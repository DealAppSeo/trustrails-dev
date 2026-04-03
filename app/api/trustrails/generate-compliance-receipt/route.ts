import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sbt_token_id, agent_id, transaction_type, amount_usdc } = body;

    if (!sbt_token_id || !agent_id || !transaction_type || amount_usdc === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Fetch SBT holder's institution
    const { data: sbt, error: sbtError } = await supabase
      .from('human_sbt_registry')
      .select('institution_id')
      .eq('token_id', sbt_token_id)
      .maybeSingle();

    if (sbtError || !sbt) {
      return NextResponse.json({ error: 'SBT not found' }, { status: 404 });
    }
    const instId = sbt.institution_id || 'default';

    // 2. Fetch institution and check dual_signature_policy
    const { data: config } = await supabase
      .from('institution_config')
      .select('settings')
      .eq('id', instId)
      .maybeSingle();

    let dual_sig_required = false;
    if (config?.settings?.require_dual_auth_above) {
      if (amount_usdc > config.settings.require_dual_auth_above) {
        dual_sig_required = true;
      }
    }

    // fallback to global policies
    const { data: policies } = await supabase
      .from('dual_signature_policy')
      .select('*')
      .eq('institution_id', instId)
      .eq('active', true);

    if (policies && policies.length > 0) {
      const applicablePolicy = policies.find(p => amount_usdc > p.threshold_usdc);
      if (applicablePolicy) dual_sig_required = true;
    }

    // 3. Insert into kya_compliance_receipts
    const receipt_id = `KYAr-${crypto.randomBytes(4).toString('hex')}-${Date.now()}`;
    const payloadToHash = `${sbt_token_id}:${agent_id}:${transaction_type}:${amount_usdc}`;
    const receipt_hash = crypto.createHash('sha256').update(payloadToHash).digest('hex');

    const { error: insertError } = await supabase
      .from('kya_compliance_receipts')
      .insert({
        receipt_id,
        token_id: sbt_token_id,
        agent_id,
        transaction_type,
        amount_usdc,
        receipt_hash,
        dual_sig_required
      });

    if (insertError) throw insertError;

    // 4. Call create_trust_event
    await supabase.rpc('create_trust_event', {
      p_event_type: 'compliance_receipt',
      p_subject_id: sbt_token_id,
      p_institution_id: instId,
      p_event_data: { receipt_id, amount: amount_usdc, dual_sig_required }
    });

    return NextResponse.json({ 
      receipt_id, 
      receipt_hash, 
      dual_sig_required 
    });

  } catch (error: any) {
    console.error('Compliance Receipt Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
