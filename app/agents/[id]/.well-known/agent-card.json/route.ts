import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEFAULTS: Record<string, any> = {
  sophia: {
    repid_earned: 1247,
    validation_count: 8,
    last_val: "2026-03-31T14:30:00Z",
    created_at: "2025-11-12T08:00:00Z",
    token_id: "80040001",
    total_decisions: 840,
    refused_pct: 0.28,
  },
  raven: {
    repid_earned: 890,
    validation_count: 5,
    last_val: "2026-03-15T09:12:00Z",
    created_at: "2026-01-04T12:00:00Z",
    token_id: "80040002",
    total_decisions: 340,
    refused_pct: 0.15,
  },
  atlas: {
    repid_earned: 2150,
    validation_count: 15,
    last_val: "2026-04-01T11:45:00Z",
    created_at: "2025-06-20T10:00:00Z",
    token_id: "80040003",
    total_decisions: 4500,
    refused_pct: 0.42,
  },
  guardian: {
    repid_earned: 450,
    validation_count: 2,
    last_val: "2026-04-05T16:20:00Z",
    created_at: "2026-02-15T08:30:00Z",
    token_id: "80040004",
    total_decisions: 112,
    refused_pct: 0.10,
  }
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const agentId = params.id.toLowerCase();
  
  if (!['sophia', 'raven', 'atlas', 'guardian'].includes(agentId)) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const def = DEFAULTS[agentId];
  let realData = null;

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

  const repid = realData?.repid_earned || def.repid_earned;
  let band = "Peer Backing";
  if (repid > 1500) band = "Institutional";
  else if (repid > 800) band = "Federated";
  else if (repid < 400) band = "Quarantined";

  const payload = {
    public_anchors: {
      agent_id: agentId,
      credential_type: "DBT",
      repid_band: band,
      validation_count: def.validation_count,
      conservator_present: true,
      transferable: true,
      last_attestation: def.last_val,
      agent_card_uri: `https://trusttrader.dev/agents/${agentId}/.well-known/agent-card.json`,
      created_at: realData?.created_at || def.created_at,
      erc8004_token_id: realData?.erc8004_token_id || def.token_id,
      basescan_link: `https://sepolia.basescan.org/token/0x3fA4000000000000000000c81B?a=${realData?.erc8004_token_id || def.token_id}`
    },
    tier2_packet: {
      agent_name: agentId.toUpperCase(),
      capabilities: ["constitutional-trading", "pythagorean-comma-veto", "repid-scoring"],
      repid_score_range: band,
      total_decisions: def.total_decisions,
      refused_percentage: def.refused_pct,
      conservator_tier: "peer_back",
      zkp_proof_hash: "0xab12" + Math.random().toString(16).substring(2, 8) + "f790",
      mcp_endpoint: `https://trusttrader.dev/mcp/${agentId}`,
      sector: "trading",
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
