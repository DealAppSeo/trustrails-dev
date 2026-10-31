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

const fake = (src) => ({ url: 'data:text/javascript,' + encodeURIComponent(src), shortCircuit: true });
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/server') {
      return fake(`export class NextRequest {}
        export const NextResponse = { json: (body, init = {}) => ({ body, status: init.status ?? 200 }) };`);
    }
    if (specifier === '@/lib/supabase-admin') {
      return fake(`export const getSupabaseAdmin = () => ({ from: (t) => {
        const b = { select: () => b, gte: () => b, then: (res) => res({ data: globalThis.__tables[t] ?? null }) };
        return b; } });`);
    }
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

beforeEach(() => {
  globalThis.__tables = {};
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
