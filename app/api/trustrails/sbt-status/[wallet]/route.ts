import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request, { params }: { params: { wallet: string } }) {
  if (req.method === 'GET') {
    // Allow public read — no auth required for demo
  }
  try {
    const { wallet } = params;

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet parameter missing' }, { status: 400 });
    }

    const { data: sbt, error } = await supabase
      .from('human_sbt_registry')
      .select('*')
      .eq('wallet_address', wallet)
      .maybeSingle();

    if (error) {
      console.warn('SBT query error:', error);
    }

    if (sbt) {
      return NextResponse.json({
        has_sbt: true,
        token_id: sbt.token_id,
        qualification_tier: sbt.qualification_tier || 'retail',
        repid_score: sbt.repid_score || 0,
        pol_timestamp: sbt.created_at
      });
    } else {
      return NextResponse.json({
        has_sbt: false,
        can_initiate: true
      });
    }

  } catch (error: any) {
    console.error('SBT Status Get Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
