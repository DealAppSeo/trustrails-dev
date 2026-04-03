import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: logs, count: logCount } = await supabase
      .from('trinity_hallucination_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: events } = await supabase
      .from('trinity_agent_logs')
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
