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
  const { data } = await supabase
    .from('kya_compliance_receipts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  return NextResponse.json({ receipts: data || [] });
}


export const dynamic = 'force-dynamic';
