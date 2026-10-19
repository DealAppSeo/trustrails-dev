// tests/compliance-receipt.test.mjs — ComplianceReceiptGenerator fails closed.
//
// No test framework is installed in this repo, so this uses node:test and Node's
// built-in TypeScript stripping. Needs Node >= 22.15 (module.registerHooks).
// Run: npm test
//
// '@/lib/supabase-admin' is redirected to an in-memory fake, so nothing here
// touches a network or a database.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === '@/lib/supabase-admin') {
      return {
        url: 'data:text/javascript,export const getSupabaseAdmin = () => globalThis.__fakeSupabase;',
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});

const { ComplianceReceiptGenerator } = await import('../lib/trustshell/ComplianceReceipt.ts');

let inserts;
let insertError;

beforeEach(() => {
  inserts = [];
  insertError = null;
  globalThis.__fakeSupabase = {
    from(table) {
      return {
        select: () => ({ eq: () => ({ single: async () => ({ data: { custodian_link_active: false }, error: null }) }) }),
        insert: async (row) => {
          inserts.push({ table, row });
          return { error: insertError };
        },
      };
    },
  };
});

const params = () => ({
  kyaResult: {
    agentName: 'SOPHIA', kya_verified: true, repidScore: 8500, repidTier: 'Gold',
    humanCustodyBound: true, zkpProofCID: 'cid', withinDailyLimit: true, withinTxLimit: true,
    insuranceCoverage: 0,
  },
  bftProof: {
    paymentId: 'p', votesFor: ['VERITAS'], votesAgainst: [], consensusWeight: 1, threshold: 0.667,
    passed: true, pythagoreanVeto: false, votedAt: '2026-10-19T00:00:00.000Z', label: 'SIMULATED',
  },
  amountUSDC: 10,
  recipientAddress: 'NEXUS',
  solanaTxHash: 'TXHASH123',
  solanaExplorerUrl: 'https://explorer.invalid/tx/TXHASH123',
  ruleHash: 'rule',
});

test('missing TRUSTRAILS_HMAC_SECRET throws and writes nothing', async () => {
  delete process.env.TRUSTRAILS_HMAC_SECRET;
  await assert.rejects(new ComplianceReceiptGenerator().generate(params()), /TRUSTRAILS_HMAC_SECRET/);
  assert.equal(inserts.length, 0);
});

test('no synthetic FB-PREAUTH id; receipt is labelled SIMULATED; auditHash uses the configured secret', async () => {
  process.env.TRUSTRAILS_HMAC_SECRET = 'test-secret';
  const p = params();
  const r = await new ComplianceReceiptGenerator().generate(p);

  assert.equal(r.fireblocksPreAuthId, null);
  assert.equal(r.label, 'SIMULATED');
  assert.ok(r.simulated.some((s) => s.startsWith('fireblocks_preauth')));
  assert.ok(r.simulated.some((s) => s.startsWith('bft_consensus')));
  assert.equal(inserts.length, 1);
  assert.equal(inserts[0].table, 'kya_compliance_receipts');
  assert.equal(inserts[0].row.fireblocks_preauth_id, null);
  assert.doesNotMatch(JSON.stringify({ r, inserts }), /FB-PREAUTH/);

  const auditData = [r.receiptId, 'SOPHIA', '8500', '10', 'NEXUS', 'true', '1.0000', 'TXHASH123', 'rule'].join(':');
  assert.equal(r.auditHash, createHmac('sha256', 'test-secret').update(auditData).digest('hex'));
  assert.notEqual(r.auditHash, createHmac('sha256', 'trinity-default-sbt-secret').update(auditData).digest('hex'));
});

test('a failed insert throws (with the tx hash) instead of returning an unpersisted receipt', async () => {
  process.env.TRUSTRAILS_HMAC_SECRET = 'test-secret';
  insertError = { message: 'violates not-null constraint' };
  await assert.rejects(
    new ComplianceReceiptGenerator().generate(params()),
    (e) => /insert failed/.test(e.message) && /TXHASH123/.test(e.message) && /not-null/.test(e.message),
  );
});
