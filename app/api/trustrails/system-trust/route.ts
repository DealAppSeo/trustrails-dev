// app/api/trustrails/system-trust/route.ts
// TrustRails Sprint — Created March 26 2026 by Gemini

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  // Pull all 12 agent RepID scores
  const { data: agents } = await getSupabaseAdmin().from('agent_kya_registry')
    .select('*');  // '*' so kya_verified (if the column exists) is visible to the tagline check

  if (!agents || agents.length === 0) {
    return NextResponse.json({ systemTrustScore: 0, status: 'no_agents' });
  }

  // Weighted average — higher RepID agents get more weight
  const totalWeight = agents.reduce((s, a) => s + a.repid_score, 0);
  const systemScore = Math.round(totalWeight / agents.length);

  // Tier distribution
  const tiers = { Platinum: 0, Gold: 0, Silver: 0, Bronze: 0 };
  agents.forEach(a => { tiers[a.repid_tier as keyof typeof tiers]++; });

  // Recent payment stats
  const since24h = new Date(Date.now() - 86_400_000).toISOString();
  const { data: receipts } = await getSupabaseAdmin().from('kya_compliance_receipts')
    .select('payment_amount_usdc, bft_passed')
    .gte('created_at', since24h);

  const totalVolume24h   = (receipts || []).filter(r => r.bft_passed).reduce((s, r) => s + Number(r.payment_amount_usdc), 0);
  const totalTxns24h     = (receipts || []).filter(r => r.bft_passed).length;
  const blockedTxns24h   = (receipts || []).filter(r => !r.bft_passed).length;

  // Level of the AVERAGE RepID. A level label, not a verification claim.
  const status =
    systemScore >= 8000 ? 'LEVEL_HIGH' :
    systemScore >= 6000 ? 'LEVEL_MID'  :
    systemScore >= 4000 ? 'LEVEL_LOW'  : 'LEVEL_MINIMAL';

  const statusColor =
    status === 'LEVEL_HIGH' ? '#22c55e' :  // green
    status === 'LEVEL_MID'  ? '#3b82f6' :  // blue
    status === 'LEVEL_LOW'  ? '#f59e0b' :  // amber
    '#ef4444';                             // red

  const { data: humanSbts } = await getSupabaseAdmin().from('human_sbt_registry')
    .select('id, qualification_tier, active_custodianships, total_agents_graduated');

  const totalHumanCustodians = humanSbts?.length || 0;
  const totalActiveCustodianships = humanSbts?.reduce(
    (sum, h) => sum + (h.active_custodianships || 0), 0
  ) || 0;
  const totalAgentsGraduated = humanSbts?.reduce(
    (sum, h) => sum + (h.total_agents_graduated || 0), 0
  ) || 0;

  return NextResponse.json({
    product:           'TrustRails',
    systemTrustScore:  systemScore,          // 0-10,000
    systemTrustPct:    (systemScore / 100).toFixed(1) + '%',
    status,
    statusColor,
    tagline:           agents.every(a => a.kya_verified === true)
      ? 'All agents KYA-verified and operating within earned limits'
      : 'Average RepID level shown; per-agent KYA verification not confirmed for every agent',
    agentCount:        agents.length,
    tierDistribution:  tiers,
    humanCustodyVerified: agents.filter(a => a.human_custody_verified).length,
    totalInsuranceCoverage: agents.reduce((s, a) => s + Number(a.insurance_coverage), 0),
    totalHumanCustodians,
    totalActiveCustodianships,
    totalAgentsGraduated,
    last24Hours: {
      paymentsExecuted: totalTxns24h,
      volumeUSDC:       totalVolume24h,
      attemptsBocked:   blockedTxns24h,
      complianceRate:   totalTxns24h + blockedTxns24h > 0
        ? ((totalTxns24h / (totalTxns24h + blockedTxns24h)) * 100).toFixed(1) + '%'
        : null,   // no attempts in 24h = not measured (rendered "not measured")
    },
    // Regulatory readiness. None of these four is checked anywhere in this codebase.
    regulatoryStatus: {
      micaCompliant:    'NOT_CHECKED',
      geniusActReady:   'NOT_CHECKED',
      fatfAligned:      'NOT_CHECKED',
      fireblocksPreAuth: 'NOT_CHECKED',
      aminaPilotReady:  systemScore >= 7500,
    },
  });
}

export const dynamic = 'force-dynamic';
