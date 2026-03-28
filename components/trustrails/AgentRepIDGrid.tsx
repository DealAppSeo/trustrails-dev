// components/trustrails/AgentRepIDGrid.tsx
// TrustRails Sprint — Created March 26 2026 by Gemini

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const _supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!_supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in Vercel Environment');
}
if (!_supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or ANON_KEY in Vercel Environment');
}


const supabase = createClient(_supabaseUrl, _supabaseKey);

const TIER_COLORS: Record<string, string> = {
  Platinum: '#e2e8f0',
  Gold:     '#fbbf24',
  Silver:   '#94a3b8',
  Bronze:   '#b45309',
};

export function AgentRepIDGrid() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('agent_kya_registry')
        .select('*')
        .order('repid_score', { ascending: false });
      setAgents(data || []);
    };
    load();

    const sub = supabase
      .channel('public:agent_kya_registry')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'agent_kya_registry' }, () => {
        load();
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
        Agent KYA Registry — Live RepID Scores
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {agents.map(agent => {
          const color = TIER_COLORS[agent.repid_tier] || '#8b9ab0';
          const pct   = (agent.repid_score / 10000) * 100;
          return (
            <div key={agent.agent_name} style={{
              background: '#1e293b',
              border: `1px solid ${color}44`,
              borderRadius: 12,
              padding: 16,
            }}>
              {/* Agent name + tier */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>
                  {agent.agent_name}
                </span>
                <div>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color,
                    border: `1px solid ${color}`,
                    borderRadius: 4, padding: '2px 6px',
                  }}>
                    {agent.repid_tier?.toUpperCase()}
                  </span>
                  {agent.lifecycle_state === 'EARNING_AUTONOMY' && (
                    <span 
                      title="Approaching autonomous threshold (RepID 9000). Human custodian exposure decreasing. Soon self-custodying — earned through verified behavior."
                      style={{ background: '#78350f', color: '#fcd34d', fontSize: '13px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', marginLeft: '4px' }}
                    >📈 EARNING</span>
                  )}
                  {agent.lifecycle_state === 'CUSTODIED_DBT' && (
                    <span 
                      title="Human custodian verified via Zero-Knowledge Proof. Identity proven, never revealed. Satisfies MiCA UBO requirement without exposing identity."
                      style={{ background: '#1e3a5f', color: '#60a5fa', fontSize: '13px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', marginLeft: '4px' }}
                    >⛓ CUSTODIED</span>
                  )}
                  {agent.lifecycle_state === 'UNCUSTODIED_DBT' && (
                    <span 
                      title="No human custodian. Agent-only liability. Limited to micro-payments. No vault access. Link a verified human custodian to unlock full capability."
                      style={{ background: '#1e293b', color: '#8b9ab0', fontSize: '13px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', marginLeft: '4px' }}
                    >💳 DBT</span>
                  )}
                </div>
              </div>

              {/* RepID score */}
              <div style={{ fontSize: 28, fontWeight: 900, color, marginTop: 8, lineHeight: 1 }}>
                {Number(agent.repid_score).toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: '#8b9ab0' }}>RepID / 10,000</div>

              {/* Progress bar */}
              <div style={{ background: '#0f172a', borderRadius: 4, height: 6, marginTop: 10 }}>
                <div style={{ width: `${pct}%`, height: 6, background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
              </div>

              {/* Badges */}
              <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {agent.human_custody_verified && (
                  <span style={{ fontSize: 13, background: '#14532d', color: '#86efac', borderRadius: 4, padding: '2px 6px' }}>
                    🔐 CUSTODY
                  </span>
                )}
                {agent.vault_access_permitted && (
                  <span style={{ fontSize: 13, background: '#1e3a5f', color: '#93c5fd', borderRadius: 4, padding: '2px 6px' }}>
                    🏦 VAULT
                  </span>
                )}
                <span style={{ fontSize: 13, background: '#1a1a2e', color: '#a78bfa', borderRadius: 4, padding: '2px 6px' }}>
                  🛡️ ${(Number(agent.insurance_coverage)/1000).toFixed(0)}K
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
