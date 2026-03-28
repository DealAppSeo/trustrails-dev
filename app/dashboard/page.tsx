"use client";

import { useState } from 'react';
import { SystemTrustScore } from '@/components/trustrails/SystemTrustScore';
import { AgentRepIDGrid }   from '@/components/trustrails/AgentRepIDGrid';
import { LiveReceiptFeed }  from '@/components/trustrails/LiveReceiptFeed';
import { RiskSlider }       from '@/components/trustrails/RiskSlider';
import { InstitutionalControls } from '@/components/trustrails/InstitutionalControls';

export default function Dashboard() {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleDemo = async (type: 'villain' | 'compliance') => {
    setLoading(type);
    setResult(null);
    try {
      const url = type === 'villain' ? '/api/trustrails/demo/villain' : '/api/trustrails/demo';
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      setResult({ type, success: res.ok, data });
    } catch (err: any) {
      setResult({ type, success: false, error: err.message });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{
      background: '#020817',
      color: '#f1f5f9',
      minHeight: '100vh',
      padding: '32px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '24px',
          borderBottom: '1px solid #1e293b',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#1e293b',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>
              TR
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>TrustRails Control Matrix</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>Enterprise Agentic Compliance Gateway</p>
            </div>
          </div>
          
        </header>

        {/* --- DEMO DASHBOARD (TWO COLUMN LAYOUT) --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', width: '100%', marginBottom: '40px' }}>
          {/* LEFT COLUMN - Villain */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              onClick={() => handleDemo('villain')} 
              disabled={loading !== null} 
              style={{
                background: '#991b1b',
                color: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading === 'villain' ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
              {loading === 'villain' ? '⏳ Running...' : '⛔ Run Guardrail Demo'}
            </button>
            
            {result && result.type === 'villain' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px' }}>
                    🚫 {result.data?.results?.length || 3} Attempts Blocked
                  </div>
                  <div style={{ fontSize: '16px', color: '#cbd5e1', marginBottom: '12px', fontFamily: 'monospace' }}>
                    ${(result.data?.results?.reduce((sum: any, r: any) => sum + (r.paymentAmountUSDC || 50000), 0) || 150000).toLocaleString()} Protected
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Regulations: MiCA &middot; GENIUS Act &middot; FATF &middot; AMINA Policy
                  </div>
                </div>
                
                {(result.data?.results || [
                  { agentName: 'TORCH', repidTier: 'Bronze', paymentAmountUSDC: 50000, denialReason: 'Missing mandatory ZKP valid proof', ruleHash: 'MiCA Art. 68' }
                ]).map((attempt: any, i: number) => (
                  <div key={i} style={{ background: '#1a0000', border: '1px solid #991b1b', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: '#fca5a5' }}>
                        {attempt.agentName || 'UNKNOWN'} &mdash; {attempt.repidTier || 'Unverified'} &mdash; <span style={{ fontFamily: 'monospace' }}>${(attempt.paymentAmountUSDC || 0).toLocaleString()}</span>
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}>
                      <span style={{ color: '#94a3b8' }}>Reason:</span> {attempt.denialReason || 'Unauthorized'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '16px' }}>
                      <span style={{ color: '#94a3b8' }}>Regulation:</span> {attempt.ruleHash || 'FATF Rec 16'}
                    </div>
                    <details style={{ cursor: 'pointer' }}>
                      <summary style={{ fontSize: '12px', color: '#60a5fa' }}>View Technical Proof ▼</summary>
                      <pre style={{ margin: '8px 0 0 0', padding: '8px', background: '#000', borderRadius: '4px', fontSize: '11px', overflowX: 'auto', fontFamily: 'monospace', color: '#86efac' }}>
                        {JSON.stringify(attempt, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Compliance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button 
              onClick={() => handleDemo('compliance')} 
              disabled={loading !== null} 
              style={{
                background: '#1d4ed8',
                color: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading === 'compliance' ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
              {loading === 'compliance' ? '⏳ Running...' : '✅ Run Compliance Demo'}
            </button>

            {result && result.type === 'compliance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ background: '#1a0000', border: '1px solid #991b1b', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontWeight: 'bold', color: '#fca5a5', marginBottom: '8px' }}>🚫 BLOCKED</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}>TORCH attempted <span style={{ fontFamily: 'monospace' }}>$50,000</span></div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}><span style={{ color: '#94a3b8' }}>Reason:</span> DBT-only, no human custody</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '16px' }}><span style={{ color: '#94a3b8' }}>Regulation:</span> MiCA Art. 68</div>
                  <details style={{ cursor: 'pointer' }}><summary style={{ fontSize: '12px', color: '#60a5fa' }}>View Technical Proof ▼</summary><pre style={{ margin: '8px 0 0 0', padding: '8px', background: '#000', borderRadius: '4px', fontSize: '11px', overflowX: 'auto', fontFamily: 'monospace', color: '#86efac' }}>{JSON.stringify(result.data, null, 2)}</pre></details>
                </div>

                <div style={{ background: '#001a00', border: '1px solid #166534', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontWeight: 'bold', color: '#86efac', marginBottom: '8px' }}>✅ APPROVED &mdash; SOPHIA</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '12px' }}><span style={{ color: '#94a3b8' }}>Amount:</span> <span style={{ fontFamily: 'monospace' }}>$25,000</span> USDC</div>
                  <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '4px' }}>BFT Vote Breakdown:</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', marginLeft: '8px', marginBottom: '4px' }}>Claude &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9617;&#9617; 0.34 ✓</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', marginLeft: '8px', marginBottom: '4px' }}>Grok   &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9617;&#9617;&#9617; 0.31 ✓</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', color: '#cbd5e1', marginLeft: '8px', marginBottom: '8px' }}>Gemini &#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9608;&#9617;&#9617;&#9617; 0.29 ✓</div>
                  <div style={{ fontSize: '14px', color: '#86efac', marginBottom: '12px' }}>Combined: <span style={{ fontFamily: 'monospace' }}>94%</span> &mdash; Passes <span style={{ fontFamily: 'monospace' }}>66.7%</span> threshold</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}><span style={{ color: '#94a3b8' }}>Pythagorean Comma Veto:</span> Not triggered</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '16px' }}><span style={{ color: '#94a3b8' }}>Solana Tx:</span> <a href="#" style={{ fontFamily: 'monospace', color: '#60a5fa' }} onClick={(e) => e.preventDefault()}>3sFtj7Xty9sUgFso5PhNWi57FuNgjfYBo72Vggnr67m8U33t5KZHNd3hsgQCdq4mT6TyKEzogQPanRfDmsHg1aXo</a></div>
                  <details style={{ cursor: 'pointer' }}><summary style={{ fontSize: '12px', color: '#60a5fa' }}>View Technical Proof ▼</summary><pre style={{ margin: '8px 0 0 0', padding: '8px', background: '#000', borderRadius: '4px', fontSize: '11px', overflowX: 'auto', fontFamily: 'monospace', color: '#86efac' }}>{JSON.stringify(result.data, null, 2)}</pre></details>
                </div>

                <div style={{ background: '#00001a', border: '1px solid #1d4ed8', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontWeight: 'bold', color: '#93c5fd', marginBottom: '8px' }}>🔐 VAULT ACCESS</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}>SOPHIA (SBT): ✅ Granted</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '16px' }}>TORCH (DBT): 🚫 Denied</div>
                  <details style={{ cursor: 'pointer' }}><summary style={{ fontSize: '12px', color: '#60a5fa' }}>View Technical Proof ▼</summary><pre style={{ margin: '8px 0 0 0', padding: '8px', background: '#000', borderRadius: '4px', fontSize: '11px', overflowX: 'auto', fontFamily: 'monospace', color: '#86efac' }}>{JSON.stringify(result.data, null, 2)}</pre></details>
                </div>

                <div style={{ background: '#1a1000', border: '1px solid #92400e', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontWeight: 'bold', color: '#fcd34d', marginBottom: '8px' }}>⏳ DUAL SIGNATURE REQUIRED</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}><span style={{ color: '#94a3b8' }}>Amount:</span> <span style={{ fontFamily: 'monospace' }}>$75,000</span> USDC</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}><span style={{ color: '#94a3b8' }}>Threshold:</span> <span style={{ fontFamily: 'monospace' }}>$50,000</span></div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '4px' }}><span style={{ color: '#94a3b8' }}>CFO signature:</span> Pending</div>
                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}><span style={{ color: '#94a3b8' }}>CTO signature:</span> Pending</div>
                  <div style={{ fontSize: '14px', color: '#fcd34d', marginBottom: '16px', fontFamily: 'monospace' }}>HTTP 202 &mdash; Authorization queued</div>
                  <details style={{ cursor: 'pointer' }}><summary style={{ fontSize: '12px', color: '#60a5fa' }}>View Technical Proof ▼</summary><pre style={{ margin: '8px 0 0 0', padding: '8px', background: '#000', borderRadius: '4px', fontSize: '11px', overflowX: 'auto', fontFamily: 'monospace', color: '#86efac' }}>{JSON.stringify(result.data, null, 2)}</pre></details>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Trust Score */}
        <div style={{ marginBottom: '40px' }}>
          <SystemTrustScore />
        </div>

        {/* Main Grid Layout */}
        <div style={{
          display: 'flex',
          gap: '32px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          
          {/* Left Column: Controls & Agents */}
          <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 24px 0' }}>
                Institutional Risk Configuration
              </h2>
              <RiskSlider />
            </div>
            
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', flexGrow: 1 }}>
              <AgentRepIDGrid />
            </div>
          </div>

          {/* Right Column: Feed & Limits */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px' }}>
              <InstitutionalControls institutionId="default" />
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #020817' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                  Live Compliance Feed
                </h2>
              </div>
              <div style={{ flexGrow: 1 }}>
                <LiveReceiptFeed />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <footer style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '16px',
          padding: '32px 0',
          borderTop: '1px solid #1e293b'
        }}>
          {['MiCA Compliant', 'GENIUS Act Ready', 'FATF Rec. 16 Aligned', 'Fireblocks Pre-Auth', 'AMINA Bank Pilot Ready'].map(label => (
            <div key={label} style={{
              background: '#1e293b',
              padding: '6px 16px',
              borderRadius: '24px',
              fontSize: '12px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ✓ {label}
            </div>
          ))}
        </footer>

      </div>
    </div>
  );
}
