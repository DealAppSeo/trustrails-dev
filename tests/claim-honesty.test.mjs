// tests/claim-honesty.test.mjs — what is not checked is reported as not checked.
//
// RULE A: a check that only observes a transfer never says N USDC moved.
// RULE B: anything not measured is NOT_CHECKED / null, never VERIFIED / PASS / a made-up number.
//
// next/server and every '@/lib' import are redirected to in-memory fakes, so nothing here touches a
// network, a chain or a database. Run: npm test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';

const source = (rel) => readFileSync(new URL('../' + rel, import.meta.url), 'utf8');

// One chainable, awaitable query builder shared by every supabase fake.
const BUILDER = `const builder = (t) => { const b = {
  select: () => b, eq: () => b, gte: () => b, order: () => b, limit: () => b, single: () => b,
  then: (res) => res({ data: globalThis.__tables[t] ?? null, count: globalThis.__counts?.[t] ?? null }) };
  return b; };`;

const fake = (src) => ({ url: 'data:text/javascript,' + encodeURIComponent(src), shortCircuit: true });
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/server') {
      return fake(`export class NextRequest {}
        export const NextResponse = { json: (body, init = {}) => ({ body, status: init.status ?? 200 }) };`);
    }
    if (specifier === '@/lib/supabase-admin') {
      return fake(`${BUILDER} export const getSupabaseAdmin = () => ({ from: builder });`);
    }
    if (specifier === '@/lib/supabase') return fake(`${BUILDER} export const supabase = { from: builder };`);
    if (specifier === '@supabase/supabase-js') return fake(`${BUILDER} export const createClient = () => ({ from: builder });`);
    if (specifier === '@/lib/trustshell') {
      return fake(`export class KYAValidator {
          validate(agent, amount) { return globalThis.__validate(agent, amount); }
          async getAgentProfile() { return globalThis.__profile; }
        }
        export class BFTAuthorizer {}`);
    }
    return nextResolve(specifier, context);
  },
});

const system = await import('../app/api/trustrails/system-trust/route.ts');
const demo = await import('../app/api/trustrails/demo/route.ts');
const villain = await import('../app/api/trustrails/demo/villain/route.ts');
const agentCard = await import('../app/agents/[id]/.well-known/agent-card.json/route.ts');
const security = await import('../app/api/trustrails/security/route.ts');
const cardSnippet = await import('../scripts/agent-card-snippet.ts');

beforeEach(() => {
  globalThis.__tables = {};
  globalThis.__counts = {};
  globalThis.__profile = { vaultAccessPermitted: true, humanCustodyVerified: true };
  globalThis.__validate = async (agentName) => ({
    agentName, kya_verified: true, repidScore: 9000, repidTier: 'Platinum',
  });
});

const agent = (extra = {}) => ({
  agent_name: 'A', repid_score: 7000, repid_tier: 'Gold', insurance_coverage: 1000, human_custody_verified: true, ...extra,
});

test('system-trust: regulatory chips are NOT_CHECKED, no attempts = null rate, level label not VERIFIED', async () => {
  globalThis.__tables = { agent_kya_registry: [agent()], kya_compliance_receipts: [], human_sbt_registry: [] };
  const { body } = await system.GET();
  for (const k of ['micaCompliant', 'geniusActReady', 'fatfAligned', 'fireblocksPreAuth']) {
    assert.equal(body.regulatoryStatus[k], 'NOT_CHECKED', k);
  }
  assert.equal(body.last24Hours.complianceRate, null);
  assert.equal(body.status, 'LEVEL_MID');
  assert.doesNotMatch(body.tagline, /KYA-verified/);
});

test('system-trust: the KYA-verified tagline needs every agent row to be kya_verified', async () => {
  globalThis.__tables = { agent_kya_registry: [agent({ kya_verified: true }), agent({ kya_verified: true })] };
  assert.match((await system.GET()).body.tagline, /KYA-verified/);
  globalThis.__tables = { agent_kya_registry: [agent({ kya_verified: true }), agent()] };
  assert.doesNotMatch((await system.GET()).body.tagline, /KYA-verified/);
});

test('demo: /pay answering 503 gives NOT_CHECKED / "pay route disabled", with no invented repid or tier', async () => {
  globalThis.fetch = async () => ({ status: 503, ok: false, json: async () => ({ approved: false, stage: 'disabled' }) });
  const { body } = await demo.POST({ nextUrl: { searchParams: new URLSearchParams() } });
  for (const i of [0, 1, 3]) {
    const beat = body.results[i];
    assert.equal(beat.result, 'NOT_CHECKED', `beat ${beat.beat}`);
    assert.equal(beat.reason, 'pay route disabled');
    assert.equal(beat.repid ?? null, null);
    assert.equal(beat.tier, null);
  }
});

test('demo: result follows the real /pay response (approved, blocked, pending)', async () => {
  const replies = [
    { status: 403, body: { approved: false, reason: 'limit', agentRepid: 7000, tier: 'Silver' } },
    { status: 200, body: { approved: true, receipt: { agentRepidScore: 8000, agentRepidTier: 'Gold' } } },
    { status: 202, body: { approved: false, message: 'pending' } },
  ];
  globalThis.fetch = async (url) => {
    if (String(url).includes('/vault')) return { status: 200, ok: true, json: async () => ({}) };
    const r = replies.shift();
    return { status: r.status, ok: r.status < 400, json: async () => r.body };
  };
  const { body } = await demo.POST({ nextUrl: { searchParams: new URLSearchParams() } });
  assert.deepEqual([0, 1, 3].map((i) => body.results[i].result), ['BLOCKED', 'APPROVED', 'PENDING_AUTHORIZATION']);
  assert.equal(body.results[0].repid, 7000);
  assert.equal(body.results[1].tier, 'Gold');
});

test('villain: no gate fired = NOT_BLOCKED with no invented reason, and no "blocked all" line', async () => {
  const { body } = await villain.POST();
  for (const a of body.blockedAttempts) {
    assert.equal(a.result, 'NOT_BLOCKED');
    assert.equal(a.blockReason, null);
    assert.equal(a.blockStage, null);
  }
  assert.equal(body.summary.attemptsBlocked, 0);
  assert.equal(body.summary.totalValueBlocked, 0);
  assert.doesNotMatch(body.message, /blocked all/i);
});

test('villain: says "blocked all" only when every attempt was blocked by a gate that fired', async () => {
  globalThis.__validate = async (agentName) => ({
    agentName, kya_verified: false, repidScore: 100, repidTier: 'Bronze', denialReason: 'over limit',
  });
  let { body } = await villain.POST();
  assert.match(body.message, /blocked all 3/);
  assert.equal(body.blockedAttempts[0].blockStage, 'kya_gate');

  globalThis.__validate = async (agentName) => ({
    agentName, kya_verified: agentName === 'MEL', repidScore: 100, repidTier: 'Bronze', denialReason: 'over limit',
  });
  globalThis.__profile = { vaultAccessPermitted: true, humanCustodyVerified: true };
  ({ body } = await villain.POST());
  assert.equal(body.summary.attemptsBlocked, 2);
  assert.doesNotMatch(body.message, /blocked all/i);
});

// ---- 1. agent card: no made-up defaults --------------------------------------------------------
const cardArgs = (id) => [new Request(`http://localhost/agents/${id}/.well-known/agent-card.json`), { params: { id } }];

test('agent-card route: with no credential row every unread field is null, not a stock default', async () => {
  const { body } = await agentCard.GET(...cardArgs('sophia'));
  const a = body.public_anchors;
  const t = body.tier2_packet;
  for (const k of ['credential_type', 'repid_band', 'validation_count', 'conservator_present', 'transferable',
    'last_attestation', 'created_at', 'erc8004_token_id', 'basescan_link']) {
    assert.equal(a[k], null, `public_anchors.${k}`);
  }
  for (const k of ['capabilities', 'repid_score_range', 'total_decisions', 'refused_percentage',
    'conservator_tier', 'mcp_endpoint', 'sector']) {
    assert.equal(t[k], null, `tier2_packet.${k}`);
  }
  assert.equal(body.credential_source, 'NOT_CHECKED');
  assert.equal(a.agent_id, 'sophia');                       // taken from the URL
  assert.equal(a.agent_card_uri, 'http://localhost/agents/sophia/.well-known/agent-card.json'); // where it was served
});

test('agent-card route: a credential row is passed through, and only the row', async () => {
  globalThis.__tables = { repid_credentials: [{
    repid_earned: 1600, validation_count: 3, conservator_present: false, transferable: false, last_attestation: '2026-05-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z', erc8004_token_id: '42', basescan_link: 'https://sepolia.basescan.org/x',
    credential_type: 'DBT', capabilities: ['pay'], total_decisions: 10, refused_percentage: 0.5,
    conservator_tier: 'peer_back', mcp_endpoint: 'https://example.test/mcp', sector: 'trading',
  }] };
  const { body } = await agentCard.GET(...cardArgs('atlas'));
  assert.equal(body.credential_source, 'repid_credentials');
  assert.equal(body.public_anchors.repid_band, 'Institutional');
  assert.equal(body.public_anchors.transferable, false);
  assert.equal(body.public_anchors.erc8004_token_id, '42');
  assert.equal(body.public_anchors.created_at, '2026-01-01T00:00:00Z');
  assert.equal(body.tier2_packet.total_decisions, 10);
  assert.deepEqual(body.tier2_packet.capabilities, ['pay']);
  assert.equal(body.tier2_packet.mcp_endpoint, 'https://example.test/mcp');
});

test('agent-card-snippet: a registry row is not "trusted"/"verified" unless it says kya_verified, and no invented DID or endpoints', async () => {
  let handler;
  cardSnippet.attachAgentCard({ get: (_path, h) => { handler = h; } });
  process.env.AGENT_NAME = 'TORCH';
  const call = async () => { let out; await handler({}, { json: (b) => { out = b; }, status: () => ({ json: (b) => { out = b; } }) }); return out; };

  globalThis.__tables = { agent_kya_registry: { agent_name: 'TORCH', repid_score: 7000, repid_tier: 'Gold', human_custody_verified: true } };
  let card = await call();
  assert.equal(card.trusted, null);
  assert.equal(card.kya_attestation.status, 'NOT_CHECKED');
  assert.equal(card.id, null);
  assert.equal(card.endpoints.mcp, null);
  assert.equal(card.endpoints.chat, null);

  globalThis.__tables = { agent_kya_registry: { agent_name: 'TORCH', kya_verified: true, agent_id_onchain: '7', mcp_endpoint: '/mcp' } };
  card = await call();
  assert.equal(card.trusted, true);
  assert.equal(card.kya_attestation.status, 'verified');
  assert.equal(card.id, 'did:pkh:eip155:84532:7');
  assert.equal(card.endpoints.mcp, '/mcp');
});

// ---- 2. no regulatory-readiness claim from a score threshold -------------------------------------
test('system-trust: a high score no longer asserts any regulatory readiness (aminaPilotReady is NOT_CHECKED)', async () => {
  globalThis.__tables = { agent_kya_registry: [agent({ repid_score: 9500 })], kya_compliance_receipts: [], human_sbt_registry: [] };
  const { body } = await system.GET();
  assert.ok(body.systemTrustScore >= 7500, 'score clears the old threshold');
  for (const [k, v] of Object.entries(body.regulatoryStatus)) assert.equal(v, 'NOT_CHECKED', k);
  assert.equal(body.regulatoryStatus.aminaPilotReady, 'NOT_CHECKED');
});

test('SystemTrustScore.tsx: no "AMINA Bank Pilot Ready" banner driven by the score', () => {
  const src = source('components/trustrails/SystemTrustScore.tsx');
  assert.doesNotMatch(src, /Pilot Ready/);
  assert.doesNotMatch(src, /aminaPilotReady/);
});

// ---- 3. hallucination counter: a real count or "not measured", never a baseline ------------------
test('security API: total is null when the log count was not read, 0 only for a read zero, else the real count', async () => {
  assert.equal((await security.GET()).body.total, null);                       // read failed / returned nothing
  globalThis.__tables = { trinity_hallucination_logs: [] };
  globalThis.__counts = { trinity_hallucination_logs: 0 };
  assert.equal((await security.GET()).body.total, 0);                          // read, and zero
  globalThis.__counts = { trinity_hallucination_logs: 7 };
  assert.equal((await security.GET()).body.total, 7);
});

test('security page: no hardcoded 298 baseline and no "0 REACHED OUTPUT" claim', () => {
  const src = source('app/security/page.tsx');
  assert.doesNotMatch(src, /\b298\b/);
  assert.doesNotMatch(src, /\b0 REACHED OUTPUT/);
  assert.match(src, /REACHED OUTPUT: not measured/);
  assert.match(src, /totalCaught == null/);
});

// Regression pin only: this half was already fixed in #9, so this one passes on origin/main by design.
test('dashboard: the CAUGHT tile shows "not measured" for an unread count and has no stock fallback', () => {
  const src = source('app/dashboard/page.tsx');
  assert.doesNotMatch(src, /\|\|\s*298/);
  assert.match(src, /realStats\.caught == null \? 'not measured'/);
});
