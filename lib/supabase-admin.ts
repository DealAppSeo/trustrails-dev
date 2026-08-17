// lib/supabase-admin.ts — the ONE server-side Supabase client for this app.
//
// WHY THIS EXISTS. Seventeen files in this repository resolved their key as:
//
//   process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// That `||` reads as a safe default and is the opposite of one. Two things are
// wrong with it, and they compound:
//
//   1. IT CANNOT SEE THE KEY THIS PROJECT ACTUALLY USES. The canonical secret is
//      `SUPABASE_SECRET_KEY` (an `sb_secret_…` key). `SUPABASE_SERVICE_ROLE_KEY`
//      is a LEGACY JWT name, and the legacy JWTs are DISABLED project-wide — so
//      that branch is either unset or holds a credential that authenticates
//      nothing.
//   2. SO THE LIVE BRANCH IS THE PUBLIC KEY. The anon key ships in the browser
//      bundle and carries `anon` privileges. Server-side writers were therefore
//      running with public authority, silently, and nothing reported it: a
//      privilege downgrade is indistinguishable from working right up until a
//      policy tightens.
//
// That is not hypothetical. On 2026-08-14 the anon UPDATE/DELETE policies on
// `trinity_agent_logs` and `trinity_artifacts` were revoked to stop ~302k rows of
// agent memory being anonymously deletable. The anon INSERT policies could NOT be
// revoked in the same change **because of this file's absence** — these writers
// may be inserting as anon, and removing that would have broken live logging.
// Fixing key resolution here is what unblocks finishing that work.
//
// NEVER ADD AN ANON FALLBACK TO THIS FILE. A missing privileged key must fail
// loudly. Continuing with less authority than the caller believes it has is the
// failure mode this file exists to remove.
//
// CONSTRUCTED LAZILY, ON PURPOSE — see the note on module scope below.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

const URL_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'] as const;

// Order matters: the current name first, legacy names accepted only as a
// transition. Set SUPABASE_SECRET_KEY and the rest can be deleted.
const KEY_VARS = [
  'SUPABASE_SECRET_KEY',        // current: sb_secret_…
  'SUPABASE_SERVICE_ROLE_KEY',  // legacy JWT — disabled project-wide
  'SUPABASE_SERVICE_KEY',
  'SUPABASE_KEY',
] as const;

function firstSet(names: readonly string[]): { name: string; value: string } | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) return { name, value };
  }
  return undefined;
}

/**
 * Server-side Supabase client, constructed on first use.
 *
 * NEVER construct a client at module scope. `next build` collects page data by
 * importing every route module, so a module-scope client — or a module-scope
 * `throw` guarding one — runs at BUILD time and fails the build when no key is
 * present. That is exactly why this repo's production build currently dies with
 * `Error: supabaseUrl is required` while "Collecting page data". Deferring
 * construction to the first request is what makes the build independent of
 * runtime credentials.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const url = firstSet(URL_VARS)?.value;
  const key = firstSet(KEY_VARS);

  if (!url) {
    throw new Error(`Supabase is not configured: set one of ${URL_VARS.join(', ')}.`);
  }
  if (!key) {
    throw new Error(
      `Supabase is not configured: set SUPABASE_SECRET_KEY (an sb_secret_… key). ` +
        `Also read, in order: ${KEY_VARS.join(', ')}. ` +
        `The anon key is deliberately NOT a fallback here.`
    );
  }

  client = createClient(url, key.value);
  return client;
}
