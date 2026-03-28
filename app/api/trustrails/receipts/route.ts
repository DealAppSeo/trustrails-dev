// app/api/trustrails/receipts/route.ts
// TrustShell Sprint — Created March 26 2026 by Gemini

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!_supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in Vercel Environment');
}
if (!_supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or ANON_KEY in Vercel Environment');
}


const supabase = createClient(_supabaseUrl, _supabaseKey);

export async function GET() {
  // Fetch receipts
  const { data: receipts } = await supabase
    .from('kya_compliance_receipts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // Fetch agent lifecycle data
  const { data: agents } = await supabase
    .from('agent_kya_registry')
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
