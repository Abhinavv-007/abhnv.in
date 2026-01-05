/**
 * File-based storage module with append-only writes and atomic updates
 */
import { readFileSync, writeFileSync, appendFileSync, renameSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');

// In-process mutex for concurrent request safety
let lockPromise = Promise.resolve();

/**
 * Acquire a lock for atomic operations
 * @param {Function} fn - Function to execute while lock is held
 * @returns {Promise<any>} Result of the function
 */
export async function withLock(fn) {
    const prevLock = lockPromise;
    let releaseLock;
    lockPromise = new Promise((resolve) => {
        releaseLock = resolve;
    });

    await prevLock;
    try {
        return await fn();
    } finally {
        releaseLock();
    }
}

/**
 * Ensure data directory and files exist
 */
export function initStorage() {
    if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
    }

    const electionsPath = join(DATA_DIR, 'elections.json');
    if (!existsSync(electionsPath)) {
        const defaultElection = {
            active_election_id: '00000000-0000-0000-0000-000000000000',
            elections: {
                '00000000-0000-0000-0000-000000000000': {
                    title: 'Glass Ballot Box Demo',
                    status: 'open',
                    created_at: new Date().toISOString(),
                    ballot_count: 0,
                    chain_head: 'GENESIS',
                    snapshot_hash: null,
                    mode: 'safe'
                }
            }
        };
        writeFileSync(electionsPath, JSON.stringify(defaultElection, null, 2));
    }

    // Create empty log files if they don't exist
    const ballotsPath = join(DATA_DIR, 'ballots.log');
    if (!existsSync(ballotsPath)) {
        writeFileSync(ballotsPath, '');
    }

    const revealsPath = join(DATA_DIR, 'reveals.log');
    if (!existsSync(revealsPath)) {
        writeFileSync(revealsPath, '');
    }
}

/**
 * Read elections.json
 * @returns {Object} Elections data
 */
export function readElections() {
    const electionsPath = join(DATA_DIR, 'elections.json');
    const data = readFileSync(electionsPath, 'utf8');
    return JSON.parse(data);
}

/**
 * Write elections.json atomically (write temp + rename)
 * @param {Object} data - Elections data to write
 */
export function writeElections(data) {
    const electionsPath = join(DATA_DIR, 'elections.json');
    const tempPath = join(DATA_DIR, 'elections.json.tmp');
    writeFileSync(tempPath, JSON.stringify(data, null, 2));
    renameSync(tempPath, electionsPath);
}

/**
 * Append a ballot to ballots.log (JSONL)
 * @param {Object} ballot - Ballot data to append
 */
export function appendBallot(ballot) {
    const ballotsPath = join(DATA_DIR, 'ballots.log');
    appendFileSync(ballotsPath, JSON.stringify(ballot) + '\n');
}

/**
 * Read all ballots from ballots.log
 * @returns {Array} Array of ballot objects
 */
export function readBallots() {
    const ballotsPath = join(DATA_DIR, 'ballots.log');
    const data = readFileSync(ballotsPath, 'utf8').trim();
    if (!data) return [];
    return data.split('\n').map(line => JSON.parse(line));
}

/**
 * Append a reveal to reveals.log (JSONL, demo mode only)
 * @param {Object} reveal - Reveal data to append
 */
export function appendReveal(reveal) {
    const revealsPath = join(DATA_DIR, 'reveals.log');
    appendFileSync(revealsPath, JSON.stringify(reveal) + '\n');
}

/**
 * Read all reveals from reveals.log
 * @returns {Array} Array of reveal objects
 */
export function readReveals() {
    const revealsPath = join(DATA_DIR, 'reveals.log');
    const data = readFileSync(revealsPath, 'utf8').trim();
    if (!data) return [];
    return data.split('\n').map(line => JSON.parse(line));
}

/**
 * Write tally proof (demo mode only)
 * @param {Object} proof - Tally proof data
 */
export function writeTallyProof(proof) {
    const proofPath = join(DATA_DIR, 'tally_proof.json');
    writeFileSync(proofPath, JSON.stringify(proof, null, 2));
}

/**
 * Read tally proof
 * @returns {Object|null} Tally proof data or null if not exists
 */
export function readTallyProof() {
    const proofPath = join(DATA_DIR, 'tally_proof.json');
    if (!existsSync(proofPath)) return null;
    const data = readFileSync(proofPath, 'utf8');
    return JSON.parse(data);
}
