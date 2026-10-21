// tests/pay-route-contain.test.mjs — POST /api/trustrails/pay is off unless TRUSTRAILS_PAY_ENABLED=true.
//
// The route has no caller authentication: a body names the agent and recipient, the Solana
// executor signs with an agent key, and RepID is raised after the transfer. Until real
// authorization exists the route must refuse before it reads the body or touches any step.
//
// next/server and every '@/lib' import are redirected to in-memory fakes that record calls,
// so nothing here touches a network, a chain or a database. Run: npm test
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
      return fake(`export const getSupabaseAdmin = () => ({ from: () => ({ insert: async () => { globalThis.__calls.push('db'); return {}; } }) });`);
    }
    if (specifier === '@/lib/trustshell/ComplianceReceipt') {
      return fake(`export const requireReceiptHmacSecret = () => { globalThis.__calls.push('hmac'); };`);
    }
    if (specifier === '@/lib/trustshell') {
      return fake(`const rec = (n) => class { constructor() { return new Proxy({}, { get: (_, m) => async () => {
          globalThis.__calls.push(n + '.' + String(m));
          return { kya_verified: true, passed: true, repidScore: 9000, threshold: 1, txHash: 'x', explorerUrl: 'x' };
        } }); } };
        export const KYAValidator = rec('kya'), BFTAuthorizer = rec('bft'), ComplianceReceiptGenerator = rec('receipt'),
          SolanaExecutor = rec('solana'), ZKPAttestationService = rec('zkp'), RepIDCalculator = rec('calc');`);
    }
    return nextResolve(specifier, context);
  },
});

const { POST } = await import('../app/api/trustrails/pay/route.ts');

let bodyRead;
const req = () => ({
  json: async () => {
    bodyRead = true;
    return { agentName: 'SOPHIA', amountUSDC: 1, recipientAddress: 'NEXUS', purpose: 'probe' };
  },
  nextUrl: { searchParams: new URLSearchParams() },
});

beforeEach(() => {
  globalThis.__calls = [];
  bodyRead = false;
  delete process.env.TRUSTRAILS_PAY_ENABLED;
});

for (const value of [undefined, '', 'false', '1', 'TRUE ', 'yes']) {
  test(`refused with TRUSTRAILS_PAY_ENABLED=${JSON.stringify(value)}: 503, body unread, no step runs`, async () => {
    if (value !== undefined) process.env.TRUSTRAILS_PAY_ENABLED = value;
    const res = await POST(req());
    assert.equal(res.status, 503);
    assert.equal(res.body.approved, false);
    assert.equal(bodyRead, false);
    assert.deepEqual(globalThis.__calls, []);
  });
}

test('only the exact string "true" lets the request through to the existing steps', async () => {
  process.env.TRUSTRAILS_PAY_ENABLED = 'true';
  await POST(req());
  assert.equal(bodyRead, true);
  assert.ok(globalThis.__calls.includes('hmac'));
});
