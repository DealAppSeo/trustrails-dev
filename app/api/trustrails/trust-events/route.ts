import { NextResponse, NextRequest } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const institution_id = searchParams.get('institution_id');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let query = getSupabaseAdmin().from('trust_events')
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
