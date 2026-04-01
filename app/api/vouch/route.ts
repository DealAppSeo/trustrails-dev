import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { target, type } = await req.json();
    const sponsor = 'sean.sbt';

    let targetDelta = type === 'time_locked' ? 20 : 15;
    let sponsorDelta = type === 'time_locked' ? 5 : 2;

    const txHash = '0x' + crypto.randomBytes(32).toString('hex');

    const { data: sponsorData } = await supabase.from('repid_scores').select('rep_score').eq('identity_address', sponsor).single();
    const { data: targetData } = await supabase.from('repid_scores').select('rep_score').eq('identity_address', target).single();

    if (sponsorData) {
      await supabase.from('repid_scores').update({ rep_score: Number(sponsorData.rep_score) + sponsorDelta }).eq('identity_address', sponsor);
    }
    if (targetData) {
      await supabase.from('repid_scores').update({ rep_score: Number(targetData.rep_score) + targetDelta }).eq('identity_address', target);
    }

    await supabase.from('vouch_relationships').insert({
      sponsor_address: sponsor,
      agent_address: target,
      vouch_type: type,
      lock_duration_days: type === 'time_locked' ? 180 : null,
      lock_expires_at: type === 'time_locked' ? new Date(Date.now() + 180*24*60*60*1000).toISOString() : null,
      status: 'active',
      sponsor_rep_delta: sponsorDelta,
      agent_rep_delta: targetDelta,
      tx_hash: txHash
    });

    await supabase.from('trust_events').insert({
      event_type: 'VOUCH_CREATED',
      actor_address: sponsor,
      target_address: target,
      tx_hash: txHash,
      details: { type, sponsor_delta: sponsorDelta, target_delta: targetDelta }
    });

    return NextResponse.json({ success: true, txHash });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
