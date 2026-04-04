import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data, error } = await supabase
      .from('community_waitlist')
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
