// tests/no-unbacked-drawdown.test.mjs — nothing shipped to people may state the TrustTrader drawdown figures.
//
// "0% drawdown vs 49.63% without the veto" and "4 constitutional refusals" were shown on /preview,
// /suite, the /trade chart legend and in the waitlist welcome email. They have no re-runnable
// source: the backtest_variance table has 0 rows, and no code in trustrails-dev, trusttrader or
// repid-engine computes a drawdown from a price path. If a real, dated, re-runnable measurement
// exists later, show THAT (with its date and source) and change this test in the same PR.
//
// Scans every text file under app/, components/ and supabase/functions/, the places that reach readers.
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CLAIM = /49\.6|\b0\s*%\s*DD\b|9,?048\.82|drawdown:?\s*0\s*%|0\s*%\s*(max\s*)?drawdown|max drawdown|constitutional refusals|4[- ]for[- ]4/i;

test('no unbacked drawdown figure in app/, components/ or supabase/functions/', () => {
  const hits = [];
  for (const root of ['app', 'components', 'supabase/functions']) {
    for (const rel of readdirSync(root, { recursive: true })) {
      const file = join(root, rel);
      if (!/\.(tsx?|mjs|js|bak|md)$/.test(file)) continue;
      readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
        if (CLAIM.test(line)) hits.push(`${file}:${i + 1}: ${line.trim().slice(0, 100)}`);
      });
    }
  }
  assert.deepEqual(hits, []);
});
