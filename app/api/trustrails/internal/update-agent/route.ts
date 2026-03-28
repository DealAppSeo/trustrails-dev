// app/api/trustrails/internal/update-agent/route.ts
// TrustRails Sprint — Created March 26 2026 by Gemini
// Proxy route to allow local setup scripts to update the production database

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!_supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in Vercel Environment');
}
if (!_supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or ANON_KEY in Vercel Environment');
}


export async function POST(req: NextRequest) {
  const { agent_name, agent_id_onchain } = await req.json();

  if (!agent_name || !agent_id_onchain) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const supabase = createClient(_supabaseUrl, _supabaseKey);

  const { data, error } = await supabase
    .from('agent_kya_registry')
    .update({
      agent_id_onchain,
      registered_at: new Date().toISOString(),
    })
    .eq('agent_name', agent_name);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, agent_name, agent_id_onchain });
}


export const dynamic = 'force-dynamic';
