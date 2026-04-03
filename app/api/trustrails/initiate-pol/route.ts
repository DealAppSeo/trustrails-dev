import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wallet_address, institution_id } = body;

    if (!wallet_address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    // Check if wallet already has active DBT or SBT
    const { data: existingDbt } = await supabase
      .from('dbt_registry')
      .select('id, status')
      .eq('wallet_address', wallet_address)
      .in('status', ['verifying', 'active'])
      .maybeSingle();

    if (existingDbt) {
      return NextResponse.json({ error: 'Wallet already has an active DBT', token_id: existingDbt.id }, { status: 400 });
    }

    const { data: existingSbt } = await supabase
      .from('human_sbt_registry')
      .select('id')
      .eq('wallet_address', wallet_address)
      .maybeSingle();

    if (existingSbt) {
      return NextResponse.json({ error: 'Wallet already has an existing SBT' }, { status: 400 });
    }

    // 1. Generate DBT token
    const shortWallet = wallet_address.startsWith('0x') ? wallet_address.slice(2, 8).toUpperCase() : wallet_address.slice(0, 6).toUpperCase();
    const token_id = `DBT-${shortWallet}-${Date.now()}`;
    const instId = institution_id || 'default';

    // 2. INSERT into dbt_registry
    const { error: dbtError } = await supabase
      .from('dbt_registry')
      .insert({
        token_id,
        wallet_address,
        institution_id: instId,
        status: 'verifying',
        factors_verified: 0
      });

    if (dbtError) throw dbtError;

    // 3 & 4. Generate OTPs
    const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
    const emailOtp = generateOtp();
    const smsOtp = generateOtp();

    const emailHash = crypto.createHash('sha256').update(emailOtp).digest('hex');
    const smsHash = crypto.createHash('sha256').update(smsOtp).digest('hex');

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: otpError } = await supabase
      .from('pol_otp_sessions')
      .insert([
        { dbt_token_id: token_id, otp_type: 'email', otp_hash: emailHash, expires_at: expiresAt, verified: false },
        { dbt_token_id: token_id, otp_type: 'sms', otp_hash: smsHash, expires_at: expiresAt, verified: false }
      ]);
      
    if (otpError) throw otpError;

    // 5. For MVP: log OTPs to console
    console.log(`[TrustRails] OTPs generated for ${wallet_address}`);
    console.log(`EMAIL OTP: ${emailOtp}`);
    console.log(`SMS OTP: ${smsOtp}`);

    // 6. Call create_trust_event (assuming the DB function accepts these parameters)
    const { error: eventError } = await supabase.rpc('create_trust_event', {
      p_event_type: 'dbt_created',
      p_subject_id: token_id,
      p_institution_id: instId,
      p_event_data: { wallet: wallet_address, factors: 0 }
    });

    if (eventError) {
      console.warn('Failed to log trust event:', eventError);
    }

    return NextResponse.json({ 
      dbt_token_id: token_id, 
      message: 'OTP sent to email and phone' 
    });

  } catch (error: any) {
    console.error('Initiate PoL Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
