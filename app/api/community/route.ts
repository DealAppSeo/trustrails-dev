import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate deterministic elements
    const randomHex = Math.random().toString(16).substring(2, 6);
    const assigned_dbt = `user-${randomHex}`;
    const referral_code = `TR-${randomHex.toUpperCase()}-${Math.floor(Math.random() * 999)}`;
    const starting_repid = 10;

    // Insert into community_waitlist
    const { data, error } = await getSupabaseAdmin().from('community_waitlist')
      .insert([
        {
          email,
          assigned_dbt,
          starting_repid,
          referral_code
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Waitlist insertion error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        assigned_dbt,
        starting_repid,
        referral_code
      }
    });
  } catch (error: any) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
