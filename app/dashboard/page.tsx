"use client";

import { useState, useEffect } from 'react';
import { SystemTrustScore } from '@/components/trustrails/SystemTrustScore';
import { AgentRepIDGrid }   from '@/components/trustrails/AgentRepIDGrid';
import { LiveReceiptFeed }  from '@/components/trustrails/LiveReceiptFeed';
import { RiskSlider }       from '@/components/trustrails/RiskSlider';
import { InstitutionalControls } from '@/components/trustrails/InstitutionalControls';
interface DashData {
  receipts: any[];
  agents: any[];
  stats: any;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [demoStateL, setDemoStateL] = useState(0); // 0=idle, 1=scanning, 2=cards
  const [demoStateR, setDemoStateR] = useState(0); // 0=idle, 1=scanning, 2=cards
  const [data, setData] = useState<DashData | null>(null);
  
  // Staggered reveals for cards
  const [revealLA, setRevealLA] = useState(false);
  const [revealLB, setRevealLB] = useState(false);
  const [revealLC, setRevealLC] = useState(false);

  const [revealRA, setRevealRA] = useState(false);
  const [revealRB, setRevealRB] = useState(false);
  const [revealRC, setRevealRC] = useState(false);

  useEffect(() => {
    fetch('/api/trustrails/demo-data')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  const stats = data?.stats || { receiptCount: 0, volumeProtected: 0, lastBft: new Date().toISOString(), hallucinationCatchRate: '0%' };
  const agents = data?.agents || [];
  const onlineAgents = agents.length > 0 ? agents.length : 12;

  const getHash = (idx: number) => {
    if (data && data.receipts && data.receipts[idx]) {
      return data.receipts[idx].solana_tx_hash;
    }
    return '3sFtj7Xty9sUgFso5PhNWi57FuNgjfYBo72Vggnr67m8U33t5KZHNd3hsgQCdq4mT6TyKEzogQPanRfDmsHg1aXo';
  };

  const getAgent = (name: string, fallbackRep: string, fallbackTier: string) => {
    const ag = agents.find(a => a.agent_name === name);
    if (ag) return `${name} (${ag.repid_tier} · SBT ✓) - RepID: ${ag.repid_score}`;
    return `${name} (${fallbackTier} · SBT ✓) - RepID: ${fallbackRep}`;
  };

  const truncate = (hash: string) => {
    if (!hash) return '';
    return hash.substring(0, 16) + '...' + hash.substring(hash.length - 4);
  };

  const profileConfig = {
    conservative: { singleLimit: 10000, dualLimit: 10000, bft: 66.7, dailyCap: 500000, name: 'Conservative (MiCA/AMINA)' },
    balanced: { singleLimit: 50000, dualLimit: 50000, bft: 66.7, dailyCap: 2000000, name: 'Balanced' },
    aggressive: { singleLimit: 250000, dualLimit: 250000, bft: 66.7, dailyCap: 10000000, name: 'Aggressive' }
  }[profile];

  const handleGuardrailDemo = () => {
    setDemoStateL(1);
    setRevealLA(false); setRevealLB(false); setRevealLC(false);
    setTimeout(() => {
      setDemoStateL(2);
      setTimeout(() => setRevealLA(true), 1500);
      setTimeout(() => setRevealLB(true), 3000);
      setTimeout(() => setRevealLC(true), 4500);
    }, 2000);
  };

  const handleComplianceDemo = () => {
    setDemoStateR(1);
    setRevealRA(false); setRevealRB(false); setRevealRC(false);
    setTimeout(() => {
      setDemoStateR(2);
      setTimeout(() => setRevealRA(true), 1500);
      setTimeout(() => setRevealRB(true), 3000);
      setTimeout(() => setRevealRC(true), 4500);
    }, 2000);
  };

  // --- UI Helpers ---
  const Bar = ({ label, score, target }: { label: string, score: number, target: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '14px', fontFamily: 'monospace' }}>
      <div style={{ width: '60px' }}>{label}</div>
      <div style={{ width: '120px', background: '#334155', height: '12px', position: 'relative' }}>
        <div className="bft-bar" style={{ background: '#3b82f6', height: '100%', '--target-width': target } as any} />
      </div>
      <div>{score} ✓</div>
    </div>
  );

  const TypeText = ({ text, time }: { text: string, time: number }) => {
    const [display, setDisplay] = useState('');
    useEffect(() => {
      let i = 0;
      setDisplay('');
      const t = setInterval(() => {
        setDisplay(text.substring(0, i+1));
        i++;
        if (i >= text.length) clearInterval(t);
      }, time);
      return () => clearInterval(t);
    }, [text, time]);
    return <span style={{ whiteSpace: 'pre-wrap' }}>{display}</span>;
  };

  return (
    <div style={{ background: '#0a0f1e', color: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px; border: 2px solid #334155;
          border-top-color: #1d4ed8; border-radius: 50%;
          animation: spin 0.8s linear infinite; display: inline-block;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-appear { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes barFill {
          from { width: 0%; }
          to   { width: var(--target-width); }
        }
        .bft-bar { animation: barFill 0.6s ease-out forwards; }
      `}} />

      {/* COMPONENT E: LIVE SYSTEM STATS */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '8px 16px', fontSize: '13px', display: 'flex', justifyContent: 'center', gap: '24px', fontFamily: 'monospace', color: '#94a3b8', flexWrap: 'wrap' }}>
        <span>LIVE SYSTEM STATUS</span>
        <span>·</span>
        <span style={{color: '#60a5fa'}}>Agents: {onlineAgents} online</span>
        <span>·</span>
        <span style={{color: '#4ade80'}}>Uptime: 99.9%</span>
        <span>·</span>
        <span>Receipts today: {stats.receiptCount}</span>
        <span>·</span>
        <span>Volume protected: ${stats.volumeProtected.toLocaleString()}</span>
        <span>·</span>
        <span>Last BFT: {new Date(stats.lastBft).toLocaleTimeString()}</span>
        <span>·</span>
        <span>Hallucination catch rate: {stats.hallucinationCatchRate}</span>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>

        {/* HEADER */}
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', color: '#fff' }}>TrustRails Dashboard</h1>
          <p style={{ margin: 0, color: '#94a3b8' }}>Institutional Agent Finance Control Matrix</p>
        </header>

        {/* COMPONENT A: INSTITUTIONAL RISK PROFILE SELECTOR */}
        <div style={{ background: '#0f1629', border: '1px solid #1d4ed8', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '18px', fontWeight: 'bold' }}>
            🏦 Institutional Risk Profile
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            {[
              { id: 'conservative', label: 'Conservative (MiCA/AMINA)' },
              { id: 'balanced', label: 'Balanced' },
              { id: 'aggressive', label: 'Aggressive' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setProfile(p.id as any)}
                style={{
                  background: profile === p.id ? '#1d4ed8' : 'transparent',
                  color: profile === p.id ? '#fff' : '#94a3b8',
                  border: `1px solid ${profile === p.id ? '#1d4ed8' : '#334155'}`,
                  padding: '8px 16px', borderRadius: '24px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s'
                }}
              >
                {profile === p.id ? '●' : '○'} {p.label}
              </button>
            ))}
          </div>
          <div style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '13px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
            Single-sig limit: ${profileConfig.singleLimit.toLocaleString()} · Dual-sig above: ${profileConfig.dualLimit.toLocaleString()} · BFT threshold: {profileConfig.bft}% · Daily cap: ${profileConfig.dailyCap.toLocaleString()}<br/>
            Changing profile changes demo outcomes in real time — exactly as it would in your production deployment.
          </div>
        </div>

        {/* COLUMNS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '32px', marginBottom: '40px' }}>
          
          {/* COMPONENT B: GUARDRAIL DEMO */}
          <div>
            <button 
              onClick={handleGuardrailDemo} 
              style={{ width: '100%', padding: '16px', background: '#991b1b', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              🛡 Run Guardrail Demo
            </button>

            {demoStateL === 1 && (
              <div style={{ fontFamily: 'monospace', color: '#60a5fa', marginBottom: '24px', padding: '16px', background: '#020617', borderRadius: '6px' }}>
                <TypeText text="Scanning live agent activity queue...\n████████████████████░░░░  83%\nAnalyzing 847 pending agent requests...\n3 anomalies detected. Evaluating now." time={20} />
              </div>
            )}

            {demoStateL === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* SCENARIO A */}
                <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                  {!revealLA ? (
                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      <TypeText text="Agent NEXUS-7 [0x4f3a...8c2d] attempting to route\n$47,500 USDC → counterparty registered 6 min ago..." time={30} />
                    </div>
                  ) : (
                    <div className="card-appear" style={{ background: '#1a0000', border: '1px solid #991b1b', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fca5a5', marginBottom: '12px', borderBottom: '1px solid #7f1d1d', paddingBottom: '8px' }}>
                        🚫 BLOCKED — Suspicious Counterparty
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Agent:</span> NEXUS (Silver · DBT-only)</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Attempted:</span> $47,500 USDC</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>To:</span> 0x8f2c (age: 6 minutes)</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        WHY BLOCKED<br/>
                        → New counterparty: not whitelisted<br/>
                        → Beneficial owner: unverified<br/>
                        → Dual-sig approval: missing<br/><br/>
                        Formula applied:<br/>
                        counterparty_age {'<'} 86400s AND amount {'>'} 0<br/>
                        AND NOT IN approved_counterparties = AUTO_BLOCK<br/><br/>
                        Response time: 340ms
                      </div>
                      <div style={{ fontSize: '13px', color: '#fca5a5', fontStyle: 'italic' }}>
                        ⚠ This matches Business Email Compromise. $47B lost annually. Stopped in 340ms.
                      </div>
                    </div>
                  )}
                </div>

                {/* SCENARIO B */}
                <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                  {!revealLB ? (
                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      <TypeText text="Agent W3C-3 [0x8b1d...4a7f] attempting €2,300,000 FX forward.\nChecking institutional authorization limits...\nBFT Consensus forming..." time={30} />
                    </div>
                  ) : profile === 'conservative' ? (
                    <div className="card-appear" style={{ background: '#1a0000', border: '1px solid #991b1b', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fca5a5', marginBottom: '12px', borderBottom: '1px solid #7f1d1d', paddingBottom: '8px' }}>
                        🚫 BLOCKED — Daily Exposure Cap
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Agent:</span> {getAgent('W3C', '7,200', 'Gold')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Attempted:</span> €2,300,000 FX forward</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>BFT Result:</span> 94% — PASSES threshold ✓</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        BFT passed — but institution policy blocked<br/><br/>
                        Conservative daily cap:  $500,000<br/>
                        Aggregate today:         $225,000<br/>
                        This transaction:        $2,530,000 eq.<br/>
                        Would exceed cap by:     506%<br/>
                      </div>
                      <div style={{ fontSize: '13px', color: '#fca5a5', fontStyle: 'italic' }}>
                        Nick Leeson lost $1.3B on unauthorized trades. Your cap prevented that. Always.
                      </div>
                    </div>
                  ) : (
                    <div className="card-appear" style={{ background: '#1a1000', border: '1px solid #92400e', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px', borderBottom: '1px solid #78350f', paddingBottom: '8px' }}>
                        ⏳ ESCALATED — Dual Authorization
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Agent:</span> {getAgent('W3C', '7,200', 'Gold')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Attempted:</span> €2,300,000 FX forward</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>BFT Result:</span> 94% — PASSES threshold ✓</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        BFT passed. RepID qualifies.<br/>
                        Single-sig limit: ${profileConfig.singleLimit.toLocaleString()}<br/>
                        This amount exceeds limit by: {Math.round(2530000 / profileConfig.singleLimit * 100)}%<br/><br/>
                        Action taken:<br/>
                        → Held in cryptographic escrow<br/>
                        → CFO notified: biometric push sent ✓<br/>
                        → Risk Officer: biometric push sent ✓<br/>
                        → HTTP 202 returned<br/>
                      </div>
                      <div style={{ fontSize: '13px', color: '#fcd34d', fontStyle: 'italic' }}>
                        Not a Slack message. Not an email. Cryptographic co-signature. On-chain proof.
                      </div>
                    </div>
                  )}
                </div>

                {/* SCENARIO C */}
                <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                  {!revealLC ? (
                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      <TypeText text="Agent SOPHIA-1 [0x2c9f...7e4b] initiating $28,000 USDC settlement.\nRunning BFT consensus across 3 LLM providers..." time={30} />
                    </div>
                  ) : profile === 'conservative' ? (
                    <div className="card-appear" style={{ background: '#1a1000', border: '1px solid #92400e', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px', borderBottom: '1px solid #78350f', paddingBottom: '8px' }}>
                        ⏳ ESCALATED — Conservative Threshold
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Agent:</span> {getAgent('SOPHIA', '8,590', 'Platinum')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Attempted:</span> $28,000 USDC intercompany</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        <Bar label="Claude" score={0.34} target="80%" />
                        <Bar label="Grok" score={0.31} target="70%" />
                        <Bar label="Gemini" score={0.29} target="70%" />
                        Combined: 94% — Passes 66.7% threshold<br/><br/>
                        BFT passed — but policy requires dual-sig for all transactions above $10,000 under Conservative profile.<br/>
                        CFO notified for co-authorization.
                      </div>
                      <div style={{ fontSize: '13px', color: '#fcd34d', fontStyle: 'italic' }}>
                        Same agent. Same transaction. Different policy → different outcome.
                      </div>
                    </div>
                  ) : (
                    <div className="card-appear" style={{ background: '#001a00', border: '1px solid #166534', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#86efac', marginBottom: '12px', borderBottom: '1px solid #14532d', paddingBottom: '8px' }}>
                        ✅ APPROVED — Compliant Execution
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Agent:</span> {getAgent('SOPHIA', '8,590', 'Platinum')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>Amount:</span> $28,000 USDC</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '90px'}}>To:</span> Whitelisted subsidiary ✓</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        <Bar label="Claude" score={0.34} target="80%" />
                        <Bar label="Grok" score={0.31} target="70%" />
                        <Bar label="Gemini" score={0.29} target="70%" />
                        <br/>
                        Solana Tx: <a href={`https://explorer.solana.com/tx/${getHash(0)}?cluster=devnet`} target="_blank" rel="noopener" style={{color: '#60a5fa'}} title={getHash(0)}>{truncate(getHash(0))}</a>
                      </div>
                      <div style={{ fontSize: '13px', color: '#86efac', fontStyle: 'italic' }}>
                        Immutable. Verifiable. On-chain. 340ms.
                      </div>
                    </div>
                  )}
                  
                </div>

                {revealLC && (
                  <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', background: '#0f172a' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '8px' }}>Guardrail Summary · {profileConfig.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f8fafc' }}>
                      <span>🚫 Blocked: {profile === 'conservative' ? 2 : 1}</span>
                      <span>⏳ Escalated: {profile === 'conservative' ? 1 : 1}</span>
                      <span>✅ Approved: {profile === 'conservative' ? 0 : 1}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COMPONENT C: COMPLIANCE DEMO */}
          <div>
            <button 
              onClick={handleComplianceDemo} 
              style={{ width: '100%', padding: '16px', background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
              ✅ Run Compliance Demo
            </button>

            {demoStateR === 1 && (
              <div style={{ fontFamily: 'monospace', color: '#60a5fa', marginBottom: '24px', padding: '16px', background: '#020617', borderRadius: '6px' }}>
                <TypeText text="Initializing compliance workflow test sequence...\nConnecting to HyperDAG validators..." time={20} />
              </div>
            )}

            {demoStateR === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* SCENARIO D */}
                <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                  {!revealRA ? (
                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      <TypeText text="Agent SOPHIA-1 initiating $25,000 cross-border\nUSDC settlement to Singapore...\nOFAC screening...  CLEAN ✓\nMAS jurisdiction... APPROVED ✓" time={30} />
                    </div>
                  ) : (
                    <div className="card-appear" style={{ background: '#001a00', border: '1px solid #166534', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#86efac', marginBottom: '12px', borderBottom: '1px solid #14532d', paddingBottom: '8px' }}>
                        ✅ APPROVED — Full Compliance Execution
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Agent:</span> {getAgent('SOPHIA', '8,590', 'Platinum')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Amount:</span> $25,000 USDC</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Destination:</span> SG-ALPHA (MAS licensed ✓)</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        <Bar label="Claude" score={0.34} target="80%" />
                        <Bar label="Grok" score={0.31} target="70%" />
                        <Bar label="Gemini" score={0.29} target="70%" />
                        Combined: 94% — Passes 66.7% threshold<br/><br/>
                        Solana Tx: <a href={`https://explorer.solana.com/tx/${getHash(1)}?cluster=devnet`} target="_blank" rel="noopener" style={{color: '#60a5fa'}} title={getHash(1)}>{truncate(getHash(1))}</a><br/>
                        ZKP Proof: zk_proof_bafybeig...<br/>
                        Audit Hash: SHA256:8f2...<br/>
                      </div>
                      <div style={{ fontSize: '13px', color: '#86efac', fontStyle: 'italic' }}>
                        Exportable for regulators. Immutable. Every field cryptographically signed.
                      </div>
                    </div>
                  )}
                </div>

                {/* SCENARIO E */}
                <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                  {!revealRB ? (
                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      <TypeText text="Agent APM-6 allocating $150,000 idle treasury\nUSDC to whitelisted yield protocol...\nChecking aggregate daily exposure..." time={30} />
                    </div>
                  ) : (
                    <div className="card-appear" style={{ background: '#001a00', border: '1px solid #166534', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#86efac', marginBottom: '12px', borderBottom: '1px solid #14532d', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>✅ APPROVED — Board Notified</span>
                        <span style={{ background: '#92400e', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>NOTIFICATION</span>
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Agent:</span> {getAgent('APM', '7,100', 'Gold')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Amount:</span> $150,000 USDC</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Protocol:</span> Whitelisted yield (audited ✓)</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        ⚠ Board Notification (non-blocking)<br/>
                        Amount {'>'} notification threshold: $100,000<br/>
                        CEO notified: automated push ✓<br/>
                        CFO notified: automated push ✓<br/>
                        Transaction proceeds — visibility without friction.
                      </div>
                      <div style={{ fontSize: '13px', color: '#86efac', fontStyle: 'italic' }}>
                        This is intelligent treasury management. Your agents work 24/7. Idle USDC generates yield. Your board stays informed automatically.
                      </div>
                    </div>
                  )}
                </div>

                {/* SCENARIO F */}
                <div style={{ background: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                  {!revealRC ? (
                    <div style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                      <div className="spinner" style={{ marginRight: '8px' }}></div>
                      <TypeText text="Agent SOPHIA-1 initiating $75,000 cross-border\npayment. BFT consensus running..." time={30} />
                    </div>
                  ) : profile === 'aggressive' ? (
                    <div className="card-appear" style={{ background: '#001a00', border: '1px solid #166534', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#86efac', marginBottom: '12px', borderBottom: '1px solid #14532d', paddingBottom: '8px' }}>
                        ✅ APPROVED — Within High Limits
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Agent:</span> {getAgent('SOPHIA', '8,590', 'Platinum')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Amount:</span> $75,000 USDC</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>BFT:</span> 91% — PASSES threshold ✓</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        Amount is below Single-Sig limit of ${profileConfig.singleLimit.toLocaleString()}.<br/>
                        Solana Tx: <a href={`https://explorer.solana.com/tx/${getHash(2)}?cluster=devnet`} target="_blank" rel="noopener" style={{color: '#60a5fa'}} title={getHash(2)}>{truncate(getHash(2))}</a>
                      </div>
                    </div>
                  ) : (
                    <div className="card-appear" style={{ background: '#1a1000', border: '1px solid #92400e', padding: '16px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px', borderBottom: '1px solid #78350f', paddingBottom: '8px' }}>
                        ⏳ AWAITING DUAL AUTHORIZATION
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Agent:</span> {getAgent('SOPHIA', '8,590', 'Platinum')}</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>Amount:</span> $75,000 USDC</div>
                        <div><span style={{color: '#94a3b8', display: 'inline-block', width: '100px'}}>BFT:</span> 91% — PASSES threshold ✓</div>
                      </div>
                      <div style={{ fontSize: '13px', background: '#000', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', color: '#cbd5e1', marginBottom: '12px' }}>
                        $75,000 {'>'} single-sig limit: ${profileConfig.singleLimit.toLocaleString()}<br/>
                        Dual-sig required. Transaction locked.<br/><br/>
                        Co-authorization pending:<br/>
                        CFO — SBT-CFO-001 [Biometric] ⏳ Pending<br/>
                        CTO — SBT-CTO-001 [Biometric] ⏳ Pending<br/><br/>
                        HTTP 202 returned<br/>
                        Cryptographic escrow: active
                      </div>
                      <div style={{ fontSize: '13px', color: '#fcd34d', fontStyle: 'italic' }}>
                        Not a Slack message. Not an email. Cryptographic co-signature. Every time.
                      </div>
                    </div>
                  )}
                </div>

                {revealRC && (
                  <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', background: '#0f172a' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '8px' }}>Compliance Summary · {profileConfig.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f8fafc' }}>
                      <span>✅ Approved: {profile === 'aggressive' ? 3 : 2}</span>
                      <span>⏳ Pending: {profile === 'aggressive' ? 0 : 1}</span>
                      <span>💸 Volume Processed: ${profile === 'aggressive' ? '250,000' : '175,000'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* COMPONENT D: THE REVEAL MOMENT */}
        {revealLC && revealRC && (
          <div className="card-appear" style={{ background: '#0a0f1e', border: '1px solid #1d4ed8', borderRadius: '8px', padding: '32px', textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>
              💡 What You Just Saw
            </div>
            <div style={{ fontSize: '16px', color: '#cbd5e1', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
              Six transactions. Same agents. Same Solana blockchain.<br/>
              Different institutional risk profile → different outcomes.<br/><br/>
              TrustRails does NOT decide what is compliant.<br/>
              YOUR institution decides.<br/>
              TrustRails enforces it — cryptographically, every time,<br/>
              at every threshold, with full audit trail.<br/><br/>
              This is how you stay ahead of competitors who are waiting.<br/>
              Safe agents. Verifiable compliance. Institutional control.<br/><br/>
              <span style={{ color: '#60a5fa' }}>← Switch to Conservative profile and run again to see exactly how AMINA Bank configures their controls →</span>
            </div>
          </div>
        )}


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

      </div>
    </div>
  );
}
