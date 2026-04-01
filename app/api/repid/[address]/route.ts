import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  const { data, error } = await supabase
    .from('repid_scores')
    .select('*')
    .eq('identity_address', params.address)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
       return NextResponse.json({ rep_score: 50 }, { status: 200 }); // Default fallback if not seeded
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json(data);
}
