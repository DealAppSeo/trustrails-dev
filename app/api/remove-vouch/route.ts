import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { target } = await req.json();
    const sponsor = 'sean.sbt';

    const { data: rel, error: relError } = await supabase
      .from('vouch_relationships')
      .select('*')
      .eq('sponsor_address', sponsor)
      .eq('agent_address', target)
      .eq('status', 'active')
      .single();

    if (!rel || relError) {
      return NextResponse.json({ error: 'No active vouch found' }, { status: 404 });
    }

    if (rel.vouch_type === 'time_locked') {
      const expires = new Date(rel.lock_expires_at);
      if (expires > new Date()) {
        const txHash = '0x' + crypto.randomBytes(32).toString('hex');
        await supabase.from('trust_events').insert({
          event_type: 'UNLINK_BLOCKED',
          actor_address: sponsor,
          target_address: target,
          tx_hash: txHash,
          details: { reason: 'Time lock constraint active', expires_at: rel.lock_expires_at }
        });
        return NextResponse.json({ error: 'BLOCKED: Vouching is time-locked and cannot be removed yet.', txHash }, { status: 403 });
      }
    }

    const targetDelta = -15;
    const sponsorDelta = -1;
    const txHash = '0x' + crypto.randomBytes(32).toString('hex');

    const { data: sponsorData } = await supabase.from('repid_scores').select('rep_score').eq('identity_address', sponsor).single();
    const { data: targetData } = await supabase.from('repid_scores').select('rep_score').eq('identity_address', target).single();

    if (sponsorData) await supabase.from('repid_scores').update({ rep_score: Number(sponsorData.rep_score) + sponsorDelta }).eq('identity_address', sponsor);
    if (targetData) await supabase.from('repid_scores').update({ rep_score: Math.max(0, Number(targetData.rep_score) + targetDelta) }).eq('identity_address', target);

    await supabase.from('vouch_relationships').update({
      status: 'removed',
      removed_at: new Date().toISOString()
    }).eq('id', rel.id);

    await supabase.from('trust_events').insert({
      event_type: 'VOUCH_REMOVED',
      actor_address: sponsor,
      target_address: target,
      tx_hash: txHash,
      details: { sponsor_delta: sponsorDelta, target_delta: targetDelta }
    });

    return NextResponse.json({ success: true, txHash });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
