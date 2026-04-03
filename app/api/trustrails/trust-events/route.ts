import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  if (req.method === 'GET') {
    // Allow public read — no auth required for demo
  }
  try {
    const { searchParams } = new URL(req.url);
    const institution_id = searchParams.get('institution_id');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = supabase
      .from('trust_events')
      .select('*', { count: 'exact' });

    if (institution_id) {
      query = query.eq('institution_id', institution_id);
    }

    const { data: events, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({ events: events || [], total: count || 0 });

  } catch (error: any) {
    console.error('Trust Events Get Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
