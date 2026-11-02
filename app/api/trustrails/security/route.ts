import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const { data: logs, count: logCount } = await getSupabaseAdmin().from('trinity_hallucination_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: events } = await getSupabaseAdmin().from('trinity_agent_logs')
      .select('*')
      .eq('action', 'hallucination_intercepted')
      .order('created_at', { ascending: false })
      .limit(50);
      
    // total = the exact row count, or null when it was not read (a failed query returns no count).
    // A 0 here means the table was read and is empty.
    return NextResponse.json({ logs: logs || [], events: events || [], total: logCount ?? null });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
