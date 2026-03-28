// app/api/trustrails/settings/route.ts
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


export async function GET(req: NextRequest) {
  const institutionId = req.nextUrl.searchParams.get('institution') || 'default';
  
  const supabase = createClient(_supabaseUrl, _supabaseKey);

  const { data } = await supabase
    .from('institution_config')
    .select('*')
    .eq('institution_id', institutionId)
    .single();

  return NextResponse.json({ config: data || {} });
}

export async function POST(req: NextRequest) {
  const { institutionId, config } = await req.json();

  if (!institutionId || !config) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const supabase = createClient(_supabaseUrl, _supabaseKey);

  const { error } = await supabase
    .from('institution_config')
    .update(config)
    .eq('institution_id', institutionId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}


export const dynamic = 'force-dynamic';
