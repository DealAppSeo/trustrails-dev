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
      
    // Stub total count or read exactly if needed
    const totalCount = logCount || (logs ? logs.length : 0);

    return NextResponse.json({ logs: logs || [], events: events || [], total: totalCount });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
