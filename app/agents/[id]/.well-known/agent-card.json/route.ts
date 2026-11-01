import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Agents that have a card route. NOTHING else about an agent is hardcoded here: every other field
// comes from the agent's repid_credentials row, or is null (= not read). No row means all null and
// credential_source "NOT_CHECKED"; a stock score, token id, date or endpoint is never filled in.
const AGENTS = ['sophia', 'raven', 'atlas', 'guardian'];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const agentId = params.id.toLowerCase();

  if (!AGENTS.includes(agentId)) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  let realData: any = null;

  try {
    const { data } = await supabase
      .from('repid_credentials')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      realData = data[0];
    }
  } catch (err) {
    console.error("DB fetch error", err);
  }

  const repid = realData?.repid_earned == null ? NaN : Number(realData.repid_earned);
  let band: string | null = null;
  if (Number.isFinite(repid)) {
    band = "Peer Backing";
    if (repid > 1500) band = "Institutional";
    else if (repid > 800) band = "Federated";
    else if (repid < 400) band = "Quarantined";
  }

  // The card's own URL is the URL it was just served from.
  const self = new URL(request.url);

  const payload = {
    credential_source: realData ? 'repid_credentials' : 'NOT_CHECKED',
    public_anchors: {
      agent_id: agentId,
      credential_type: realData?.credential_type ?? null,
      repid_band: band,
      validation_count: realData?.validation_count ?? null,
      conservator_present: realData?.conservator_present ?? null,
      transferable: realData?.transferable ?? null,
      last_attestation: realData?.last_attestation ?? null,
      agent_card_uri: self.origin + self.pathname,
      created_at: realData?.created_at ?? null,
      erc8004_token_id: realData?.erc8004_token_id ?? null,
      basescan_link: realData?.basescan_link ?? null
    },
    tier2_packet: {
      agent_name: agentId.toUpperCase(),
      capabilities: realData?.capabilities ?? null,
      repid_score_range: band,
      total_decisions: realData?.total_decisions ?? null,
      refused_percentage: realData?.refused_percentage ?? null,
      conservator_tier: realData?.conservator_tier ?? null,
      mcp_endpoint: realData?.mcp_endpoint ?? null,
      sector: realData?.sector ?? null,
      constitutional_architecture: "Pythagorean Comma BFT Veto — threshold 531441/524288"
    },
    tier3_packet: {
      access_required: "fiduciary_conservator_or_institutional",
      zkp_circuit: "conservatorship_circuit",
      status: "ZKP verification required",
      preview: "Full RepID history, decision log, validation artifacts available to authorized parties"
    }
  };

  return NextResponse.json(payload, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
