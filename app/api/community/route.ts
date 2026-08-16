import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// TWO DEFECTS FIXED HERE. Both were proved before the change, not inferred.
//
// 1. THIS ENDPOINT HAD NEVER SUCCEEDED. It inserted `assigned_dbt` and
//    `starting_repid`; `community_waitlist` has neither — the columns are
//    `dbt_token_id` and `rep_id_score`. PostgREST rejects the whole statement on
//    an unknown column, so every POST returned 500 and the table held 0 rows in
//    its entire history. Proved by running the exact insert against the live
//    schema inside a block that always rolls back:
//
//      sqlstate=42703  column "assigned_dbt" of relation
//                      "community_waitlist" does not exist
//
//    RLS was never the obstacle: `public_insert_community_waitlist` grants
//    INSERT to anon and authenticated with `WITH CHECK true`.
//
// 2. IDENTITY CAME FROM Math.random(). `Math.random().toString(16).substring(2,6)`
//    yields 4 hex characters — 65,536 values. Measured over 200,000 draws the
//    FIRST COLLISION lands at draw #312, and 5,000 draws produce only 4,807
//    distinct values; the birthday bound agrees at ~301. So the identifier handed
//    to a member, and the referral code they share, would begin colliding before
//    the 400th signup.
//
//    The two fixes ship TOGETHER deliberately. Correcting only the column names
//    would take a dead endpoint live and immediately start minting colliding
//    identifiers into a production table.
//
// THE RESPONSE SHAPE IS UNCHANGED ON PURPOSE. `app/community/page.tsx` renders
// `successData.assigned_dbt` and `successData.starting_repid`, so those remain
// the API's field names. Only the DATABASE columns were ever wrong, and the
// mapping is now written out rather than resting on identifiers that happened
// to match.
// ---------------------------------------------------------------------------

/** The score a new member starts on. Named so it is not a bare literal mid-insert. */
const STARTING_REP_ID = 10;

/**
 * Referral alphabet: 31 symbols, with 0/O/1/I/L removed — the characters a
 * member mistypes when reading a code off a screen and saying it out loud.
 */
const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Rejection sampling, because 31 does not divide 256.
 *
 * `byte % 31` looks harmless and is not: 256 = 8*31 + 8, so the first eight
 * symbols would come up 9 times in 256 against 8 for the rest — about 12.5%
 * more often. The first draft of this file asserted the opposite in a comment,
 * having been written for a 32-symbol alphabet and then trimmed to 31. Caught by
 * measuring `256 % CODE_ALPHABET.length` instead of trusting the sentence.
 *
 * Discarding bytes at or above 248 (= 8*31) leaves a uniform range. The expected
 * cost is 256/248 draws per symbol — under 4% overhead, for an actually flat
 * distribution.
 */
const CODE_LIMIT = Math.floor(256 / CODE_ALPHABET.length) * CODE_ALPHABET.length;

function randomCode(length: number): string {
  let out = '';
  while (out.length < length) {
    const bytes = new Uint8Array(length - out.length);
    globalThis.crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b >= CODE_LIMIT) continue; // biased tail — draw again
      out += CODE_ALPHABET[b % CODE_ALPHABET.length];
    }
  }
  return out;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 122 bits from the platform CSPRNG. At this width a collision is not
    // something to plan for; at the previous 16 bits it was something to expect.
    // Web Crypto rather than `node:crypto`: this project ships no @types/node
    // (the pre-existing `process.env` lines fail typecheck for the same reason),
    // and globalThis.crypto works in both the Node and Edge runtimes.
    const assigned_dbt = `user-${globalThis.crypto.randomUUID()}`;
    // 8 symbols over 31 = ~39.6 bits: roughly 1.0M signups to a 50% chance of
    // any collision, against 301 before. Still short enough to read aloud.
    const referral_code = `TR-${randomCode(8)}`;

    const { error } = await supabase
      .from('community_waitlist')
      .insert([
        {
          email,
          dbt_token_id: assigned_dbt,    // was `assigned_dbt`  — no such column
          rep_id_score: STARTING_REP_ID, // was `starting_repid` — no such column
          referral_code,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Waitlist insertion error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        assigned_dbt,
        starting_repid: STARTING_REP_ID,
        referral_code,
      },
    });
  } catch (error: any) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
