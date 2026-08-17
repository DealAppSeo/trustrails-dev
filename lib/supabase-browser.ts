// lib/supabase-browser.ts — the ONE browser-side Supabase client for this app.
//
// WHY THIS EXISTS, and why it is separate from supabase-admin.
//
// Three `'use client'` components in this repository resolved their key as:
//
//   process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// In the browser that first branch is always `undefined` — Next inlines only
// `NEXT_PUBLIC_*` — so it silently fell through to the anon key and appeared to
// work. But client components are also SERVER-RENDERED during prerender, and on
// the server `SUPABASE_SERVICE_ROLE_KEY` may well be set. The same component
// therefore ran with SERVICE-ROLE authority during SSR and anon authority after
// hydration: two different privilege levels from one line of code, depending on
// where it executed. A service credential must never appear in a code path that
// also runs in the browser.
//
// This file reads ONLY public key names. There is no privileged branch to fall
// through from, so the privilege level is the same everywhere it runs.
//
// LITERAL REFERENCES ARE MANDATORY. Next inlines `NEXT_PUBLIC_*` by STATIC
// ANALYSIS of literal `process.env.NEXT_PUBLIC_…` references. A computed lookup
// like `process.env[name]` is not inlined and is `undefined` in the browser —
// which is why this is a hand-written list rather than a loop, unlike the server
// helper next to it.
//
// These keys are PUBLIC by design: a publishable key maps to the `anon` Postgres
// role and ships in the bundle. Anything reachable under an `anon` RLS policy is
// reachable by anyone who views source. That is a reason to keep RLS tight, not
// a reason to hide the key.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function readBrowserKey(): { name: string; value: string } | null {
  const candidates: Array<[string, string | undefined]> = [
    ['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY],
    ['NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
  ];
  for (const [name, value] of candidates) {
    if (value) return { name, value };
  }
  return null;
}

/**
 * Browser Supabase client, constructed on first use.
 *
 * Lazy for the same reason as the server helper: a module-scope client (or a
 * module-scope `throw` guarding one) executes during prerender and fails the
 * build when the environment is incomplete.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = readBrowserKey();

  if (!url) {
    throw new Error('Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL.');
  }
  if (!key) {
    throw new Error(
      'Supabase is not configured: set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ' +
        '(an sb_publishable_… key). NEXT_PUBLIC_SUPABASE_ANON_KEY is also read.'
    );
  }

  client = createClient(url, key.value);
  return client;
}
