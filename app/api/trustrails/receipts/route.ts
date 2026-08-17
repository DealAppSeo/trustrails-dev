// app/api/trustrails/receipts/route.ts
// TrustShell Sprint — Created March 26 2026 by Gemini

import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  // Fetch receipts
  const { data: receipts } = await getSupabaseAdmin().from('kya_compliance_receipts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // Fetch agent lifecycle data
  const { data: agents } = await getSupabaseAdmin().from('agent_kya_registry')
    .select('agent_name, lifecycle_state, custodian_link_active, custodian_tier, repid_score, repid_tier');

  // Merge in JavaScript
  const enrichedReceipts = receipts?.map(r => {
    const agent = agents?.find(a => a.agent_name === r.agent_name);
    return {
      ...r,
      lifecycle_state: agent?.lifecycle_state,
      custodian_link_active: agent?.custodian_link_active,
      custodian_tier: agent?.custodian_tier,
      agent_repid_score: agent?.repid_score || r.agent_repid_score,
      repid_tier: agent?.repid_tier
    };
  }) || [];

  return NextResponse.json({ receipts: enrichedReceipts });
}

export const dynamic = 'force-dynamic';
