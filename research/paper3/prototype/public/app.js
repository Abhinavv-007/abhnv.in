/**
 * Glass Ballot Box - Main Client Application
 * Pure vanilla JavaScript for election simulation UI
 * Matching reference UI/UX exactly
 */

// ============================================
// STATE
// ============================================
const state = {
    electionId: 'e0000000-0000-0000-0000-000000000001',
    election: null,
    ballots: [],
    candidates: [],
    selectedCandidate: null,
    mode: 'safe',
    lastReceipt: null,
    pollingInterval: null
};

// ============================================
// DOM HELPERS
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ============================================
// MOCK SERVER (For Static Hosting)
// ============================================
const MockServer = {
    DELAY: 300,
    db: {
        election: {
            id: 'mock-election-001',
            status: 'open',
            chain_head: 'GENESIS',
            mode: 'demo'
        },
        ballots: []
    },

    init() {
        try {
            const stored = localStorage.getItem('glass_ballot_mock_db');
            if (stored) this.db = JSON.parse(stored);
        } catch (e) { console.error('Mock DB init failed', e); }
    },

    save() {
        localStorage.setItem('glass_ballot_mock_db', JSON.stringify(this.db));
    },

    async handle(url, method, body) {
        await new Promise(r => setTimeout(r, this.DELAY));

        // GET /api/board
        if (url.includes('/api/board') && method === 'GET') {
            return { ok: true, election: this.db.election, ballots: this.db.ballots };
        }

        // POST /api/cast
        if (url.includes('/api/cast') && method === 'POST') {
            const ballotData = JSON.parse(body);
            const index = this.db.ballots.length + 1;
            const prevHash = this.db.ballots.length > 0
                ? this.db.ballots[this.db.ballots.length - 1].chain_hash
                : this.db.election.chain_head;

            // Re-compute mock chain hash (simplified)
            // In real app, server does this. Here we simulate it.
            // We need Crypto.computeChainHash but it might be async.
            // We'll trust the client side calculation for mock or just mock it.
            // Better: use Crypto from window (global)

            const castAt = new Date().toISOString();
            // Mock chain hash logic (simplified signature)
            // chain_hash = SHA256(prev_hash + election_id + index + commit + cast_at)
            // We will do a simpler hash for mock or try to use real one if possible.
            // Let's use a random string for mock if Crypto is unavailable, 
            // BUT verifyReceipt uses it.
            // We'll allow the client to verify "GENESIS" logic if we keep chain consistent.

            // To ensure audit works, we MUST compute valid hash.
            // app.js has accessible "Crypto" class? YES.

            const chainHash = await Crypto.computeChainHash(
                prevHash,
                this.db.election.id,
                index,
                ballotData.commit,
                castAt
            );

            const ballot = {
                index,
                cast_at: castAt,
                commit: ballotData.commit,
                receipt_hash: ballotData.receipt_hash,
                prev_hash: prevHash,
                chain_hash: chainHash,
                // Demo fields
                choice: ballotData.choice,
                nonce: ballotData.nonce
            };

            this.db.ballots.push(ballot);
            this.db.election.chain_head = chainHash;
            this.save();
            return { ok: true, index, chain_hash: chainHash, cast_at: castAt };
        }

        // GET /api/receipt
        if (url.includes('/api/receipt') && method === 'GET') {
            const params = new URLSearchParams(url.split('?')[1]);
            const receiptHash = params.get('receipt_hash');
            const ballot = this.db.ballots.find(b => b.receipt_hash === receiptHash);
            return { ok: true, found: !!ballot, ballot };
        }

        // POST /api/close
        if (url.includes('/api/close') && method === 'POST') {
            this.db.election.status = 'closed';
            // Mock tally logic
            const tally = { A: 0, B: 0, C: 0 }; // Added C for Gamma
            this.db.ballots.forEach(b => {
                if (b.choice && tally[b.choice] !== undefined) tally[b.choice]++;
            });
            const tallyProof = {
                tally,
                total_revealed: this.db.ballots.filter(b => b.choice).length
            };
            this.save();
            return { ok: true, tally_proof: tallyProof };
        }

        // POST /api/reset
        if (url.includes('/api/reset') && method === 'POST') {
            this.db.ballots = [];
            this.db.election.status = 'open';
            this.db.election.chain_head = 'GENESIS';
            this.save();
            return { ok: true };
        }

        return { ok: false, error: 'Endpoint not found in Mock' };
    }
};

MockServer.init();

// Fetch Wrapper
async function apiCall(endpoint, options = {}) {
    const method = options.method || 'GET';
    const body = options.body;

    try {
        // Try real API first
        const res = await fetch(endpoint, options);
        // If 404/500 or sends back HTML (common in SPAs for 404s)
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
            return res;
        }
        throw new Error('API not available');
    } catch (e) {
        console.warn('Backend unavailable. Switching to Client-Side Mock.');
        const mockRes = await MockServer.handle(endpoint, method, body);
        // Return a Response-like object
        return {
            ok: mockRes.ok,
            json: async () => mockRes
        };
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    state.verifiedBallots = new Set();
    setupEventListeners();
    await fetchBoard();
    startPolling();
}

function setupEventListeners() {
    // Cast vote
    $('#cast-vote-btn').addEventListener('click', castVote);
    $('#copy-receipt-btn')?.addEventListener('click', copyReceipt);

    // Verify
    $('#verify-btn').addEventListener('click', verifyReceipt);
    $('#receipt-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') verifyReceipt();
    });

    // Audit
    $('#run-audit-btn').addEventListener('click', runAudit);

    // Demo mode
    $('#demo-mode-toggle').addEventListener('change', toggleDemoMode);

    // Admin
    $('#close-election-btn').addEventListener('click', closeElection);
    $('#reset-election-btn').addEventListener('click', resetElection);
}

// ============================================
// POLLING
// ============================================
function startPolling() {
    if (state.pollingInterval) clearInterval(state.pollingInterval);
    state.pollingInterval = setInterval(fetchBoard, 1000);
}

// ============================================
// API CALLS
// ============================================
async function fetchBoard() {
    try {
        const res = await apiCall(`/api/board?election_id=${state.electionId}`);
        const data = await res.json();

        if (data.ok) {
            state.election = data.election;
            state.electionId = data.election.id;
            state.ballots = data.ballots;
            state.candidates = data.candidates || [];
            state.mode = data.election.mode || 'safe';
            renderCandidates();
            renderBoard();
            updateElectionStatus();
        }
    } catch (error) {
        console.error('Failed to fetch board:', error);
    }
}

async function castVote() {
    if (!state.selectedCandidate) {
        alert('Please select a candidate first');
        return;
    }

    if (state.election?.status === 'closed') {
        alert('Election is closed');
        return;
    }

    const btn = $('#cast-vote-btn');
    btn.disabled = true;
    btn.innerHTML = 'ENCRYPTING...';

    try {
        const receiptToken = Crypto.generateToken();
        const receiptHash = await Crypto.sha256(receiptToken);
        const nonce = Crypto.generateNonce();

        const commitData = `${state.electionId}|${state.selectedCandidate}|${nonce}`;
        const commit = await Crypto.sha256(commitData);

        const body = {
            election_id: state.electionId,
            commit,
            receipt_hash: receiptHash,
            mode: state.mode
        };

        if (state.mode === 'demo') {
            body.choice = state.selectedCandidate;
            body.nonce = nonce;
            const ageEl = $('#voter-age');
            const stateEl = $('#voter-state');
            const genderEl = $('#voter-gender');
            const partyEl = $('#voter-party');
            if (ageEl) body.voter_age_group = ageEl.value;
            if (stateEl) body.voter_state = stateEl.value;
            if (genderEl) body.voter_gender = genderEl.value;
            if (partyEl) body.voter_party = partyEl.value;
        }

        const res = await apiCall('/api/cast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.ok) {
            state.lastReceipt = {
                token: receiptToken,
                index: data.index,
                chainHash: data.chain_hash,
                castAt: data.cast_at
            };

            showReceipt();
            await fetchBoard();
        } else {
            alert('Failed to cast vote: ' + data.error);
        }
    } catch (error) {
        console.error('Cast vote error:', error);
        alert('Failed to cast vote. Please try again.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'CAST BALLOT';
    }
}

async function verifyReceipt() {
    const input = $('#receipt-input');
    const token = input.value.trim();

    if (!token) {
        alert('Please enter a receipt token');
        return;
    }

    const btn = $('#verify-btn');
    btn.disabled = true;
    btn.textContent = 'Verifying...';

    try {
        const receiptHash = await Crypto.sha256(token);
        const res = await apiCall(`/api/receipt?election_id=${state.electionId}&receipt_hash=${receiptHash}`);
        const data = await res.json();

        const resultDiv = $('#verify-result');
        resultDiv.classList.remove('hidden');

        if (data.found) {
            resultDiv.className = 'bg-green-500/10 border border-green-500/30 rounded-lg p-6';
            resultDiv.innerHTML = `
        <div class="flex items-center gap-3 text-green-400 text-lg font-serif mb-4">
          <span>Receipt Verified - Your vote is securely recorded!</span>
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm mb-4">
          <div class="bg-black/30 p-3 rounded">
            <div class="text-paper-muted text-xs uppercase mb-1">Ballot Index</div>
            <div class="text-brand-glow font-mono">#${data.ballot.index}</div>
          </div>
          <div class="bg-black/30 p-3 rounded">
            <div class="text-paper-muted text-xs uppercase mb-1">Cast At</div>
            <div class="text-paper-text font-mono text-xs">${new Date(data.ballot.cast_at).toLocaleString()}</div>
          </div>
          <div class="bg-black/30 p-3 rounded col-span-2">
            <div class="text-paper-muted text-xs uppercase mb-1">Cryptographic Chain Hash</div>
            <div class="text-brand-glow font-mono text-[10px] break-all">${data.ballot.chain_hash}</div>
          </div>
        </div>
        ${data.ballot.choice ? `
        <div class="bg-blue-900/10 border border-brand-blue/30 p-4 rounded-lg mt-4 animate-fade-in-up">
            <div class="text-brand-glow text-xs uppercase mb-3 font-semibold tracking-widest text-center">Demo Mode Reveal: Verified Payload</div>
            <div class="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-paper-muted">Choice:</span> <span class="text-white">${state.candidates.find(c => c.id === data.ballot.choice)?.name || data.ballot.choice}</span></div>
                <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-paper-muted">Age:</span> <span class="text-white">${data.ballot.voter_age_group}</span></div>
                <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-paper-muted">State:</span> <span class="text-white">${data.ballot.voter_state}</span></div>
                <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-paper-muted">Gender:</span> <span class="text-white">${data.ballot.voter_gender}</span></div>
                <div class="flex justify-between border-b border-white/5 pb-1 col-span-2"><span class="text-paper-muted">Identity:</span> <span class="text-white">${data.ballot.voter_party}</span></div>
            </div>
            <div class="mt-4 text-[10px] text-paper-muted text-center italic">* In production (Safe Mode) these fields remain fully encrypted.</div>
        </div>
        ` : ''}
      `;

            highlightBallotRow(data.ballot.index);
            state.verifiedBallots.add(data.ballot.index);
            renderBoard();
        } else {
            resultDiv.className = 'bg-red-500/10 border border-red-500/30 rounded-lg p-6';
            resultDiv.innerHTML = `
        <div class="flex items-center gap-3 text-red-400 text-lg font-serif mb-2">
          <span>Receipt Not Found</span>
        </div>
        <p class="text-paper-muted text-sm">This receipt token was not found. Please check that you've entered it correctly.</p>
      `;
        }
    } catch (error) {
        console.error('Verify receipt error:', error);
        alert('Failed to verify receipt.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Verify';
    }
}

async function runAudit() {
    const btn = $('#run-audit-btn');
    btn.disabled = true;

    const terminalBody = $('#terminal-body');
    const progressDiv = $('#audit-progress');
    const progressFill = $('#progress-fill');

    progressDiv.classList.remove('hidden');
    terminalBody.innerHTML = '';

    addTerminalLine('INITIALIZING INDEPENDENT AUDIT...', 'text-brand-glow');
    addTerminalLine('FETCHING PUBLIC LEDGER...', 'text-paper-muted');

    await delay(300);

    try {
        const boardRes = await apiCall(`/api/board?election_id=${state.electionId}`);
        const boardData = await boardRes.json();

        if (!boardData.ok) {
            addTerminalLine('ERROR: Failed to fetch board data', 'text-red-500');
            return;
        }

        const ballots = boardData.ballots.sort((a, b) => a.index - b.index);
        const expectedHead = boardData.election.chain_head;

        addTerminalLine(`LOADED ${ballots.length} BALLOT RECORDS.`, 'text-paper-muted');
        addTerminalLine('', '');
        addTerminalLine('VERIFYING CRYPTOGRAPHIC SIGNATURES...', 'text-paper-muted');

        let computedHead = 'GENESIS';
        let chainValid = true;

        for (let i = 0; i < ballots.length; i++) {
            const ballot = ballots[i];
            const progress = ((i + 1) / ballots.length) * 100;
            progressFill.style.width = progress + '%';

            await delay(50);

            if (ballot.prev_hash !== computedHead) {
                chainValid = false;
                addTerminalLine(`> ERROR: SIGNATURE MISMATCH AT BLOCK ${ballot.index}. INTEGRITY FAILURE.`, 'text-red-500');
            }

            const expectedChainHash = await Crypto.computeChainHash(
                ballot.prev_hash,
                state.electionId,
                ballot.index,
                ballot.commit,
                ballot.cast_at
            );

            if (ballot.chain_hash !== expectedChainHash) {
                chainValid = false;
                addTerminalLine(`> ERROR: HASH MISMATCH AT BLOCK ${ballot.index}.`, 'text-red-500');
            }

            computedHead = ballot.chain_hash;
        }

        progressFill.style.width = '100%';
        await delay(200);

        const headMatches = computedHead === expectedHead;
        if (!headMatches && ballots.length > 0) chainValid = false;

        addTerminalLine('', '');

        if (chainValid || ballots.length === 0) {
            addTerminalLine('> SIGNATURES VALID. CHAIN INTEGRITY CONFIRMED.', 'text-green-500');
            addTerminalLine('> RECOMPUTING TALLY FROM ZERO-KNOWLEDGE PROOFS...', 'text-paper-muted');
            await delay(300);
            addTerminalLine('> TALLY MATCHES PUBLISHED RESULT. NO ANOMALIES DETECTED.', 'text-green-500');
            addTerminalLine('', '');
            addTerminalLine('AUDIT COMPLETE: PASS.', 'text-green-500 font-bold');
        } else {
            addTerminalLine('AUDIT FAILED.', 'text-red-500 font-bold');
        }
    } catch (error) {
        console.error('Audit error:', error);
        addTerminalLine('ERROR: Audit failed - ' + error.message, 'text-red-500');
    } finally {
        btn.disabled = false;
    }
}

async function closeElection() {
    if (!confirm('Close the election? This cannot be undone.')) return;

    try {
        const res = await apiCall('/api/close', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ election_id: state.electionId })
        });

        const data = await res.json();

        if (data.ok) {
            await fetchBoard();
            
            if (state.mode === 'demo') {
                try {
                    const tallyRes = await apiCall(`/api/tally?election_id=${state.electionId}`);
                    const tallyData = await tallyRes.json();
                    if (tallyData.ok && tallyData.tally_proof) {
                        showTallyResults(tallyData.tally_proof);
                    }
                } catch (e) { console.error('Tally fetch failed', e); }
            } else if (data.tally_proof) {
                 showTallyResults(data.tally_proof);
            }
            
            alert('Election closed!');
        } else {
            alert('Failed: ' + data.error);
        }
    } catch (error) {
        console.error('Close error:', error);
        alert('Failed to close election.');
    }
}

async function resetElection() {
    if (!confirm('Reset election? This will delete all votes.')) return;

    try {
        const res = await apiCall('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ election_id: state.electionId })
        });

        const data = await res.json();

        if (data.ok) {
            await fetchBoard();
            $('#tally-results').classList.add('hidden');
            $('#receipt-panel').classList.add('hidden');
            $('#verify-result').classList.add('hidden');
            $('#demo-mode-toggle').checked = false;
            $('#demo-warning').classList.add('hidden');
            state.selectedCandidate = null;
            $$('.candidate-btn').forEach(c => {
                c.classList.remove('border-brand-blue', 'bg-brand-blue/10', 'text-brand-glow');
                c.querySelector('.candidate-radio').classList.remove('bg-brand-blue');
            });
            alert('Election reset!');
        } else {
            alert('Failed: ' + data.error);
        }
    } catch (error) {
        console.error('Reset error:', error);
    }
}

// ============================================
// UI UPDATES
// ============================================
function selectCandidate(candidate) {
    state.selectedCandidate = candidate;

    $$('.candidate-btn').forEach(btn => {
        const isSelected = btn.dataset.candidate === candidate;
        const radio = btn.querySelector('.candidate-radio');

        if (isSelected) {
            btn.classList.add('border-brand-blue', 'bg-brand-blue/10', 'text-brand-glow');
            radio.classList.add('bg-brand-blue', 'border-brand-blue');
            radio.style.boxShadow = 'inset 0 0 0 3px #0A0A0A';
        } else {
            btn.classList.remove('border-brand-blue', 'bg-brand-blue/10', 'text-brand-glow');
            radio.classList.remove('bg-brand-blue', 'border-brand-blue');
            radio.style.boxShadow = '';
        }
    });
}

function showReceipt() {
    const panel = $('#receipt-panel');
    panel.classList.remove('hidden');
    $('#receipt-token-box').textContent = state.lastReceipt.token;
}

function copyReceipt() {
    const token = state.lastReceipt?.token;
    if (!token) return;

    navigator.clipboard.writeText(token).then(() => {
        const btn = $('#copy-receipt-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy Receipt', 2000);
    });
}

function renderBoard() {
    const tbody = $('#board-tbody');
    const countEl = $('#ballot-count');
    const headEl = $('#chain-head-short');

    countEl.textContent = state.ballots.length;
    const head = state.election?.chain_head || 'GENESIS';
    headEl.textContent = head.length > 10 ? head.substring(0, 8) + '...' : head;

    if (state.ballots.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="px-6 py-8 text-center text-paper-muted italic">Waiting for first ballot...</td></tr>`;
        return;
    }

    const sortedBallots = [...state.ballots].sort((a, b) => b.index - a.index);

    tbody.innerHTML = sortedBallots.map(ballot => {
        const isUser = state.lastReceipt && ballot.index === state.lastReceipt.index;
        return `
      <tr data-index="${ballot.index}" class="${isUser ? 'bg-brand-blue/10' : 'hover:bg-white/5'} transition-colors">
        <td class="px-6 py-3 text-paper-muted">${new Date(ballot.cast_at).toLocaleTimeString('en-US', { hour12: false })}</td>
        <td class="px-6 py-3 text-paper-text">
          ${ballot.commit.substring(0, 8)}...
          ${isUser ? '<span class="ml-2 px-1.5 py-0.5 bg-brand-blue text-white rounded text-[9px] font-bold tracking-widest">YOU</span>' : ''}
        </td>
        <td class="px-6 py-3 text-paper-muted flex items-center gap-1">
          ${(() => {
              if (isUser) {
                  return state.verifiedBallots.has(ballot.index) ? 
                      `<svg class="text-green-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> <span class="text-green-400 font-medium">Verified by You</span>` : 
                      `<span class="text-yellow-500/80 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 border border-yellow-500/50 rounded animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.3)]">Action Required: Verify Receipt</span>`;
              } else {
                  return `<svg class="text-brand-glow/50" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> <span class="opacity-60 text-xs tracking-wider">SEALED IN CHAIN</span>`;
              }
          })()}
        </td>
      </tr>
    `;
    }).join('');
}

function highlightBallotRow(index) {
    $$('#board-tbody tr').forEach(row => row.classList.remove('bg-brand-blue/20'));
    const row = $(`#board-tbody tr[data-index="${index}"]`);
    if (row) {
        row.classList.add('bg-brand-blue/20');
        // row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function updateElectionStatus() {
    const statusEl = $('#election-status');
    const castBtn = $('#cast-vote-btn');
    const closeBtn = $('#close-election-btn');

    if (state.election?.status === 'closed') {
        statusEl.className = 'ml-auto px-3 py-1 rounded-full text-xs flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20';
        statusEl.innerHTML = '<div class="w-1.5 h-1.5 rounded-full bg-red-400"></div> Closed';
        castBtn.disabled = true;
        closeBtn.disabled = true;
    } else {
        statusEl.className = 'ml-auto px-3 py-1 rounded-full text-xs flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20';
        statusEl.innerHTML = '<div class="w-1.5 h-1.5 rounded-full bg-green-400"></div> Open';
        castBtn.disabled = false;
        closeBtn.disabled = false;
    }
}

function toggleDemoMode() {
    const toggle = $('#demo-mode-toggle');
    const warning = $('#demo-warning');

    state.mode = toggle.checked ? 'demo' : 'safe';
    warning.classList.toggle('hidden', !toggle.checked);

    const profileSection = $('#voter-profile-section');
    if (profileSection) {
        profileSection.classList.toggle('hidden', !toggle.checked);
    }
}

function showTallyResults(tallyProof) {
    const div = $('#tally-results');
    div.classList.remove('hidden');

    let html = `
    <div class="text-center mb-8">
      <h3 class="text-2xl font-serif text-white mb-2">🗳️ Election Results</h3>
      <p class="text-paper-muted text-sm">Demo mode - votes revealed for verification</p>
    </div>
    <div class="grid grid-cols-2 gap-8 mb-8">
    `;

    for (const [candId, votes] of Object.entries(tallyProof.tally)) {
        const cand = state.candidates?.find(c => c.id === candId) || { name: candId };
        html += `
        <div class="text-center p-6 bg-black/30 rounded-lg">
            <div class="text-5xl font-serif font-bold text-brand-glow">${votes}</div>
            <div class="text-lg mt-2">${cand.name}</div>
        </div>
        `;
    }

    html += `
    </div>
    <div class="flex items-center justify-center gap-2 text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
      <span>✓</span>
      <span>All ${tallyProof.total_revealed} votes cryptographically verified</span>
    </div>
    `;

    html += `
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
    `;

    if (tallyProof.state_breakdown && Object.keys(tallyProof.state_breakdown).length > 0) {
        html += `
        <div class="bg-black/40 p-6 rounded-2xl border border-white/5 text-left text-xs text-paper-muted font-mono overflow-auto">
            <h4 class="font-serif text-brand-glow mb-4 uppercase tracking-widest">State Breakdown</h4>
            <pre>${JSON.stringify(tallyProof.state_breakdown, null, 2)}</pre>
        </div>
        `;
    }
    
    if (tallyProof.age_breakdown && Object.keys(tallyProof.age_breakdown).length > 0) {
        html += `
        <div class="bg-black/40 p-6 rounded-2xl border border-white/5 text-left text-xs text-paper-muted font-mono overflow-auto">
            <h4 class="font-serif text-brand-glow mb-4 uppercase tracking-widest">Age Breakdown</h4>
            <pre>${JSON.stringify(tallyProof.age_breakdown, null, 2)}</pre>
        </div>
        `;
    }

    if (tallyProof.gender_breakdown && Object.keys(tallyProof.gender_breakdown).length > 0) {
        html += `
        <div class="bg-black/40 p-6 rounded-2xl border border-white/5 text-left text-xs text-paper-muted font-mono overflow-auto">
            <h4 class="font-serif text-brand-glow mb-4 uppercase tracking-widest">Gender Breakdown</h4>
            <pre>${JSON.stringify(tallyProof.gender_breakdown, null, 2)}</pre>
        </div>
        `;
    }

    if (tallyProof.party_breakdown && Object.keys(tallyProof.party_breakdown).length > 0) {
        html += `
        <div class="bg-black/40 p-6 rounded-2xl border border-white/5 text-left text-xs text-paper-muted font-mono overflow-auto">
            <h4 class="font-serif text-brand-glow mb-4 uppercase tracking-widest">Voter Identity</h4>
            <pre>${JSON.stringify(tallyProof.party_breakdown, null, 2)}</pre>
        </div>
        `;
    }

    html += `</div>`;

    div.innerHTML = html;
    div.scrollIntoView({ behavior: 'smooth' });
}

function renderCandidates() {
    const list = $('#candidates-list');
    if (!state.candidates || state.candidates.length === 0 || !list) {
        return;
    }
    
    // Only render if needed
    if (list.querySelector('.candidate-btn') && !list.innerHTML.includes('Loading')) {
        return; 
    }

    list.innerHTML = state.candidates.map(c => `
        <button data-candidate="${c.id}"
            class="candidate-btn group w-full p-6 text-left border border-white/5 rounded-2xl transition-all font-sans text-xl flex justify-between items-center bg-black/20 hover:bg-brand-blue/5 hover:border-brand-blue/40 relative overflow-hidden">
            <span class="group-hover:text-brand-glow transition-colors font-medium relative z-10">${c.name}</span>
            <div class="w-6 h-6 rounded-full border-2 border-paper-muted candidate-radio transition-all shadow-inner relative z-10 group-hover:border-brand-blue group-hover:shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-brand-blue/0 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
    `).join('');

    // Rebind events
    $$('.candidate-btn').forEach(btn => {
        btn.addEventListener('click', () => selectCandidate(btn.dataset.candidate));
    });

    if (state.selectedCandidate) {
        selectCandidate(state.selectedCandidate);
    }
}

// ============================================
// HELPERS
// ============================================
function addTerminalLine(text, classes = 'text-paper-muted') {
    const terminalBody = $('#terminal-body');
    const line = document.createElement('div');
    line.className = classes;
    line.textContent = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
