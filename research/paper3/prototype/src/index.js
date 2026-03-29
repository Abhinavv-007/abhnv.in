import manifest from '__STATIC_CONTENT_MANIFEST';
import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { generateUUID, computeChainHash, computeSnapshotHash, sha256 } from './hash.js';

const app = new Hono();


// Helper for atomic D1 operations (Cloudflare D1 natively handles txns in batch)
// Currently D1 does not have explicit transactions exposed in REST other than batch.
// But we can fetch, verify, and conditionally insert within the worker since a worker scales per request.
// Wait, for strict appending with chain hashes, race conditions on Workers can be tricky.
// However, considering it's a prototype/demo scale, sequential await on queries is acceptable, 
// and `chain_head` update in SQL can be done with `UPDATE ... WHERE chain_head = prev_hash`
// to ensure atomicity and reject races.

// ===================================
// Endpoints
// ===================================

/**
 * GET /api/board
 * Return election metadata and public ballots
 */
app.get('/api/board', async (c) => {
    try {
        const election_id = c.req.query('election_id');
        if (!election_id) return c.json({ ok: false, error: 'Missing election_id' }, 400);

        const db = c.env.DB;

        // Fetch Election
        const election = await db.prepare('SELECT * FROM elections WHERE id = ?').bind(election_id).first();
        if (!election) return c.json({ ok: false, error: 'Election not found' }, 404);

        // Fetch Candidates
        const { results: candidates } = await db.prepare('SELECT id, name, party, platform, avatar_url FROM candidates WHERE election_id = ?').bind(election_id).all();

        // Fetch Ballots
        const { results: ballots } = await db.prepare('SELECT ballot_id, `index`, cast_at, commit_hash as `commit`, receipt_hash, prev_hash, chain_hash FROM ballots WHERE election_id = ? ORDER BY `index` ASC').bind(election_id).all();

        return c.json({
            ok: true,
            ballots,
            candidates,
            election: {
                id: election.id,
                title: election.title,
                status: election.status,
                chain_head: election.chain_head,
                mode: election.mode
            }
        });
    } catch (e) {
        console.error(e);
        return c.json({ ok: false, error: e.message }, 500);
    }
});

/**
 * POST /api/cast
 * Cast a cryptographic ballot
 */
app.post('/api/cast', async (c) => {
    try {
        const body = await c.req.json();
        const { election_id, commit, receipt_hash, mode, choice, nonce, voter_age_group, voter_state, voter_gender, voter_party } = body;

        if (!election_id || !commit || !receipt_hash) {
            return c.json({ ok: false, error: 'Missing required fields' }, 400);
        }

        const db = c.env.DB;

        // Fetch election to get current state
        const election = await db.prepare('SELECT status, chain_head, mode FROM elections WHERE id = ?').bind(election_id).first();
        if (!election) return c.json({ ok: false, error: 'Election not found' }, 404);
        if (election.status !== 'open') return c.json({ ok: false, error: 'Election is closed' }, 400);

        // Check duplicate receipt
        const duplicate = await db.prepare('SELECT ballot_id FROM ballots WHERE receipt_hash = ?').bind(receipt_hash).first();
        if (duplicate) return c.json({ ok: false, error: 'Duplicate receipt_hash' }, 400);

        const current_count = (await db.prepare('SELECT COUNT(*) as c FROM ballots WHERE election_id = ?').bind(election_id).first()).c;

        const prev_hash = election.chain_head;
        const index = current_count + 1;
        const cast_at = new Date().toISOString();
        const chain_hash = await computeChainHash(prev_hash, election_id, index, commit, cast_at);
        const ballot_id = generateUUID();

        // Prepare statements for atomicity
        const stmts = [];

        // Insert Ballot
        stmts.push(db.prepare(`
            INSERT INTO ballots (ballot_id, election_id, \`index\`, cast_at, commit_hash, receipt_hash, prev_hash, chain_hash, mode)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(ballot_id, election_id, index, cast_at, commit, receipt_hash, prev_hash, chain_hash, mode || 'safe'));

        // Update Election Chain Head
        // We use WHERE chain_head = prev_hash to safely prevent race conditions (optimistic locking)
        stmts.push(db.prepare(`
            UPDATE elections SET chain_head = ? WHERE id = ? AND chain_head = ?
        `).bind(chain_hash, election_id, prev_hash));

        // Insert Reveal (Demo Mode)
        if (election.mode === 'demo' && choice && nonce) {
            stmts.push(db.prepare(`
                INSERT INTO reveals (ballot_id, election_id, choice, nonce, voter_age_group, voter_state, voter_party, voter_gender)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(ballot_id, election_id, choice, nonce, voter_age_group || null, voter_state || null, voter_party || null, voter_gender || null));
        }

        // Execute batch
        const results = await db.batch(stmts);

        // If the election update didn't change a row, there was a concurrency conflict
        if (results[1].meta.changes === 0) {
            return c.json({ ok: false, error: 'Concurrency conflict. Please try casting your ballot again.' }, 409);
        }

        return c.json({
            ok: true,
            index,
            chain_hash,
            cast_at,
            head: chain_hash
        });

    } catch (e) {
        console.error(e);
        return c.json({ ok: false, error: e.message }, 500);
    }
});

/**
 * GET /api/receipt
 */
app.get('/api/receipt', async (c) => {
    try {
        const election_id = c.req.query('election_id');
        const receipt_hash = c.req.query('receipt_hash');
        
        if (!election_id || !receipt_hash) return c.json({ ok: false, error: 'Missing parameters' }, 400);

        const ballot = await c.env.DB.prepare(`
            SELECT b.ballot_id, b.\`index\`, b.cast_at, b.commit_hash as \`commit\`, b.receipt_hash, b.prev_hash, b.chain_hash,
                   r.voter_age_group, r.voter_state, r.voter_gender, r.voter_party, r.choice
            FROM ballots b
            LEFT JOIN reveals r ON b.ballot_id = r.ballot_id
            WHERE b.election_id = ? AND b.receipt_hash = ?
        `).bind(election_id, receipt_hash).first();

        if (!ballot) {
            return c.json({ ok: true, found: false, ballot: null });
        }

        return c.json({ ok: true, found: true, ballot });
    } catch(e) {
        return c.json({ ok: false, error: e.message }, 500);
    }
});

/**
 * GET /api/verify
 */
app.get('/api/verify', async (c) => {
    try {
        const election_id = c.req.query('election_id');
        const receipt_hash = c.req.query('receipt_hash');
        if (!election_id) return c.json({ ok: false, error: 'Missing election_id' }, 400);

        const db = c.env.DB;
        const election = await db.prepare('SELECT chain_head FROM elections WHERE id = ?').bind(election_id).first();
        if (!election) return c.json({ ok: false, error: 'Election not found' }, 404);

        const { results: ballots } = await db.prepare('SELECT * FROM ballots WHERE election_id = ? ORDER BY `index` ASC').bind(election_id).all();

        const errors = [];
        let computedHead = 'GENESIS';
        let chainValid = true;
        let receiptFound = false;
        let receiptIndex = null;

        for (let i = 0; i < ballots.length; i++) {
            const ballot = ballots[i];
            const expectedIndex = i + 1;

            if (ballot.index !== expectedIndex) {
                errors.push(`Ballot at position ${i}: expected index ${expectedIndex}, got ${ballot.index}`);
                chainValid = false;
            }
            if (ballot.prev_hash !== computedHead) {
                errors.push(`Ballot ${ballot.index}: prev_hash mismatch.`);
                chainValid = false;
            }

            const expectedChainHash = await computeChainHash(ballot.prev_hash, election_id, ballot.index, ballot.commit_hash, ballot.cast_at);
            if (ballot.chain_hash !== expectedChainHash) {
                errors.push(`Ballot ${ballot.index}: chain_hash mismatch.`);
                chainValid = false;
            }

            computedHead = ballot.chain_hash;

            if (receipt_hash && ballot.receipt_hash === receipt_hash) {
                receiptFound = true;
                receiptIndex = ballot.index;
            }
        }

        const headMatches = computedHead === election.chain_head;
        if (!headMatches) {
            errors.push('Final head mismatch.');
            chainValid = false;
        }

        return c.json({
            ok: true,
            chain_valid: chainValid,
            computed_head: computedHead,
            expected_head: election.chain_head,
            head_matches: headMatches,
            ballot_count: ballots.length,
            receipt_found: receiptFound,
            receipt_index: receiptIndex,
            errors
        });
    } catch(e) {
        return c.json({ ok: false, error: e.message }, 500);
    }
});

/**
 * POST /api/close
 */
app.post('/api/close', async (c) => {
    try {
        const body = await c.req.json();
        const election_id = body.election_id;
        if (!election_id) return c.json({ ok: false, error: 'Missing election_id' }, 400);

        const db = c.env.DB;
        const election = await db.prepare('SELECT * FROM elections WHERE id = ?').bind(election_id).first();
        if (!election) return c.json({ ok: false, error: 'Election not found' }, 404);
        if (election.status === 'closed') return c.json({ ok: false, error: 'Already closed' }, 400);

        const count = (await db.prepare('SELECT COUNT(*) as c FROM ballots WHERE election_id = ?').bind(election_id).first()).c;
        const closed_at = new Date().toISOString();
        const snapshot_hash = await computeSnapshotHash(election.chain_head, count, closed_at);

        await db.prepare('UPDATE elections SET status = ?, closed_at = ?, snapshot_hash = ? WHERE id = ?').bind('closed', closed_at, snapshot_hash, election_id).run();

        return c.json({
            ok: true,
            closed_at,
            snapshot_hash
        });
    } catch(e) {
        return c.json({ ok: false, error: e.message }, 500);
    }
});

/**
 * GET /api/tally
 */
app.get('/api/tally', async (c) => {
    try {
        const election_id = c.req.query('election_id');
        const db = c.env.DB;
        const election = await db.prepare('SELECT * FROM elections WHERE id = ?').bind(election_id).first();
        
        if (!election || election.status !== 'closed' || election.mode !== 'demo') {
            return c.json({ ok: false, error: 'Tally unavailable' }, 400);
        }

        // Get Candidates
        const { results: candidates } = await db.prepare('SELECT id, name FROM candidates WHERE election_id = ?').bind(election_id).all();
        
        // Let's do a join to get verified reveals
        // Usually, tally would run crypto verification here. In a DB, we assume the reveals
        // match what was inserted, but we can also return them so client verifies.
        
        const { results: reveals } = await db.prepare(`
            SELECT r.ballot_id, r.choice, r.voter_age_group, r.voter_state, r.voter_gender, r.voter_party, b.commit_hash, r.nonce
            FROM reveals r
            JOIN ballots b ON r.ballot_id = b.ballot_id
            WHERE r.election_id = ?
        `).bind(election_id).all();

        // Tally counting
        const tally = {};
        const stateTally = {};
        const ageTally = {};
        const genderTally = {};
        const partyTally = {};

        for (const cand of candidates) tally[cand.id] = 0;

        for (const row of reveals) {
            // Re-verify the commit hash to prove tamper resistance
            const expectedCommit = await sha256(`${election_id}|${row.choice}|${row.nonce}`);
            if (expectedCommit === row.commit_hash) {
                tally[row.choice] = (tally[row.choice] || 0) + 1;

                if (row.voter_state) {
                    if (!stateTally[row.voter_state]) stateTally[row.voter_state] = {};
                    stateTally[row.voter_state][row.choice] = (stateTally[row.voter_state][row.choice] || 0) + 1;
                }
                
                if (row.voter_age_group) {
                    if (!ageTally[row.voter_age_group]) ageTally[row.voter_age_group] = {};
                    ageTally[row.voter_age_group][row.choice] = (ageTally[row.voter_age_group][row.choice] || 0) + 1;
                }
                if (row.voter_gender) {
                    if (!genderTally[row.voter_gender]) genderTally[row.voter_gender] = {};
                    genderTally[row.voter_gender][row.choice] = (genderTally[row.voter_gender][row.choice] || 0) + 1;
                }
                if (row.voter_party) {
                    if (!partyTally[row.voter_party]) partyTally[row.voter_party] = {};
                    partyTally[row.voter_party][row.choice] = (partyTally[row.voter_party][row.choice] || 0) + 1;
                }
                if (row.voter_gender) {
                    if (!genderTally[row.voter_gender]) genderTally[row.voter_gender] = {};
                    genderTally[row.voter_gender][row.choice] = (genderTally[row.voter_gender][row.choice] || 0) + 1;
                }
            }
        }

        return c.json({
            ok: true,
            found: true,
            tally_proof: {
                election_id,
                closed_at: election.closed_at,
                snapshot_hash: election.snapshot_hash,
                tally,
                state_breakdown: stateTally,
                age_breakdown: ageTally,
                gender_breakdown: genderTally,
                party_breakdown: partyTally,
                total_revealed: reveals.length
            }
        });
    } catch(e) {
        return c.json({ ok: false, error: e.message }, 500);
    }
});

/**
 * POST /api/reset
 */
app.post('/api/reset', async (c) => {
    try {
        const body = await c.req.json();
        const election_id = body.election_id;
        const db = c.env.DB;
        
        await db.batch([
            db.prepare('DELETE FROM reveals WHERE election_id = ?').bind(election_id),
            db.prepare('DELETE FROM ballots WHERE election_id = ?').bind(election_id),
            db.prepare('UPDATE elections SET status = "open", chain_head = "GENESIS", closed_at = NULL, snapshot_hash = NULL WHERE id = ?').bind(election_id)
        ]);
        
        return c.json({ ok: true });
    } catch(e) {
        return c.json({ ok: false, error: e.message }, 500);
    }
});

// Serve static files from the KV namespace
app.get('/', serveStatic({ path: 'index.html', manifest }));
app.get('/*', serveStatic({ root: './', manifest }));

// Setup fallback for missing routes
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

export default app;
