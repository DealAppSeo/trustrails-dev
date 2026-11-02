// tests/contain-writes.test.mjs — every API write is refused unless TRUSTRAILS_WRITES_ENABLED=true.
//
// No API route authenticates its caller and the server holds a service key for Trinity
// production tables plus signing keys, so containment has to sit in front of all of them.
// next/server is replaced by an in-memory fake; nothing here touches a network or database.
// Run: npm test
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/server') {
      const src = `export const NextResponse = {
        json: (body, init = {}) => ({ body, status: init.status ?? 200 }),
        next: () => ({ passed: true }),
      };`;
      return { url: 'data:text/javascript,' + encodeURIComponent(src), shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});

const { middleware, config } = await import('../middleware.ts');
const req = (method, pathname = '/api/trustrails/settings') => ({ method, nextUrl: { pathname } });

beforeEach(() => { delete process.env.TRUSTRAILS_WRITES_ENABLED; });

test('covers every API route', () => {
  assert.equal(config.matcher, '/api/:path*');
});

test('refuses writes by default, for every write method', () => {
  for (const m of ['POST', 'PUT', 'PATCH', 'DELETE', 'post']) {
    const r = middleware(req(m));
    assert.equal(r.status, 503, m);
    assert.equal(r.body.error, 'disabled');
  }
});

test('only the exact string "true" turns writes on', () => {
  for (const v of ['', 'false', '1', 'TRUE', 'true ', 'yes']) {
    process.env.TRUSTRAILS_WRITES_ENABLED = v;
    assert.equal(middleware(req('POST')).status, 503, JSON.stringify(v));
  }
  process.env.TRUSTRAILS_WRITES_ENABLED = 'true';
  assert.deepEqual(middleware(req('POST')), { passed: true });
});

test('reads pass untouched', () => {
  for (const m of ['GET', 'HEAD', 'OPTIONS']) assert.deepEqual(middleware(req(m)), { passed: true });
});

test('the GET route that wrote to production is gone', () => {
  // GET /api/trustrails/internal/run-tasks?key=trinity set trinity_tasks to in_progress for five
  // agents and inserted a "confirmed" Solana report; the key was in this public repo. A GET passes
  // the middleware, so the route itself had to go, with its unauthenticated sibling.
  assert.equal(existsSync(new URL('../app/api/trustrails/internal/run-tasks/route.ts', import.meta.url)), false);
  assert.equal(existsSync(new URL('../app/api/trustrails/internal/update-agent/route.ts', import.meta.url)), false);
});
