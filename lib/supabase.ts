// lib/supabase.ts — the shared client, now constructed LAZILY.
//
// WHAT CHANGED AND WHAT DELIBERATELY DID NOT.
//
// This file used to be:
//
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
//   export const supabase = createClient(supabaseUrl, supabaseKey);
//
// The export ran at MODULE SCOPE. `next build` imports every route module to
// collect page data, so that line executed at BUILD time — and `createClient`
// throws `supabaseUrl is required` when the environment is incomplete. This file
// is imported by ten others, so it took several routes down with it and was the
// single largest cause of the production build failure.
//
// The fix is deferral, not re-credentialing. The exported binding is now a proxy
// that constructs the real client on FIRST PROPERTY ACCESS — which happens when
// a request calls `supabase.from(...)`, never at import time. Every call site is
// unchanged.
//
// THE KEY IS DELIBERATELY UNCHANGED. This still resolves the PUBLIC key, exactly
// as before. That is not an oversight:
//
//   - Five of the ten importers are browser code: `WaitlistForm`,
//     `SuiteWaitlistForm`, `RiskSlider`, and the `'use client'` pages `signals`
//     and `leaderboard`. A privileged key must never reach them.
//   - The other five are server routes. Switching THOSE to service_role would
//     silently grant them write authority they have never had — and the anon
//     UPDATE/DELETE policies on the shared agent tables were just revoked, so a
//     privilege change here would land in the middle of a boundary that is being
//     tightened. That is a behaviour change and belongs in its own review, not
//     folded into a build fix.
//
// NAMED FOLLOW-UP, so it is not lost: those five server routes read through a
// PUBLIC key. That is not a fallback bug — it is the deliberate configuration of
// this shared module — but it is worth deciding on. Either they genuinely only
// need anon access, in which case say so, or they should import
// `getSupabaseAdmin()` directly and stop using this module.

import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

/**
 * Lazily-constructed shared client.
 *
 * A `get` trap is enough: supabase-js is used entirely through property access
 * (`.from`, `.rpc`, `.auth`, `.channel`, …). Methods are bound to the real
 * client so `this` is correct once they are pulled off the proxy.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseBrowser();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
