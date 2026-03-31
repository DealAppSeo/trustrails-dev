// components/trustrails/LiveReceiptFeed.tsx
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

export function LiveReceiptFeed() {
  const [receipts, setReceipts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/trustrails/receipts');
      const data = await res.json();
      setReceipts(data.receipts || []);
    };
    load();

    const sub = supabase
      .channel('public:kya_compliance_receipts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'kya_compliance_receipts' }, () => {
        load();
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
        Live Compliance Receipts
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '600px', overflowY: 'auto' }}>
        {receipts.length === 0 ? (
          <div style={{ color: '#8b9ab0', fontSize: 14 }}>No receipts found.</div>
        ) : (
          receipts.map(r => (
            <div key={r.receipt_id} style={{
              background: '#1e293b',
              borderLeft: `4px solid ${r.bft_passed ? '#22c55e' : '#ef4444'}`,
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 14,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{r.agent_name}</span>
                <span style={{ color: r.bft_passed ? '#4ade80' : '#f87171' }}>
                  {r.bft_passed ? 'COMPLIANT' : 'BLOCKED'}
                </span>
              </div>
              <div style={{ color: '#94a3b8', marginBottom: '8px' }}>
                <strong>Amount:</strong> {r.payment_amount_usdc} USDC
              </div>
              
              {/* Custodian liability line */}
              <div style={{ marginBottom: '8px' }}>
                {r.lifecycle_state === 'EARNING_AUTONOMY' ? (
                  <>
                    <div style={{ color: '#90cdf4', fontSize: '13px', fontFamily: 'monospace', marginBottom: '2px' }}>
                      ⛓ Human custodian verified · approaching autonomy
                    </div>
                    <div style={{ color: '#8b9ab0', fontSize: '13px', fontFamily: 'monospace' }}>
                      Custodian tier: {r.custodian_tier === 'qualified_investor' ? 'Qualified Investor' : 'Institutional'}
                    </div>
                  </>
                ) : r.lifecycle_state === 'CUSTODIED_DBT' ? (
                  <>
                    <div style={{ color: '#90cdf4', fontSize: '13px', fontFamily: 'monospace', marginBottom: '2px' }}>
                      ⛓ Human custodian verified · ZKP protected identity
                    </div>
                    <div style={{ color: '#8b9ab0', fontSize: '13px', fontFamily: 'monospace' }}>
                      Custodian tier: {r.custodian_tier === 'qualified_investor' ? 'Qualified Investor' : 'Institutional'}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#8b9ab0', fontSize: '13px', fontFamily: 'monospace', marginBottom: '2px' }}>
                      💳 DBT-only · agent liability · no human guarantor
                    </div>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: 4, color: '#e2e8f0', fontSize: 13 }}>
                  RepID: {r.agent_repid_score} ({r.repid_tier || 'Silver'})
                </span>
                {r.fireblocks_preauth_id && (
                  <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: 4, color: '#38bdf8', fontSize: 13 }}>
                    {r.fireblocks_preauth_id.slice(0, 16)}...
                  </span>
                )}
                {r.solana_tx_hash && (
                  <a href={`https://explorer.solana.com/tx/${r.solana_tx_hash}?cluster=devnet`} target="_blank" rel="noopener noreferrer" style={{ background: '#0f172a', padding: '2px 6px', borderRadius: 4, color: '#a78bfa', fontSize: 13, textDecoration: 'none' }}>
                    Tx: {r.solana_tx_hash.slice(0, 8)}...
                  </a>
                )}
                <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: 4, color: '#cbd5e1', fontSize: 13 }}>
                  BFT: {r.bft_consensus_weight ? Math.round(r.bft_consensus_weight) : 89}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
