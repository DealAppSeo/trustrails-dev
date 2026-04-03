"use client";

import { useState } from "react";
import Link from "next/link";

export default function CRELicensePage() {
  const [demoState, setDemoState] = useState(0); // 0=idle, 1=analyzing, 2=caught

  const runDemo = () => {
    setDemoState(1);
    setTimeout(() => {
      setDemoState(2);
    }, 2500); // simulate 2.5s agent processing
  };

  return (
    <div style={{ background: '#020817', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Navigation */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 32px', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#1e293b', display: 'flex',
            alignItems: 'center', justifyContent: 'center', borderRadius: '6px', fontWeight: 'bold'
          }}>
            TR
          </div>
          <Link href="/" style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>TrustRails</Link>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: '15px' }}>Enter Dashboard</Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ padding: '64px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', background: '#ecfdf5', color: '#059669', padding: '6px 16px',
            borderRadius: '24px', fontSize: '13px', fontWeight: 'bold', marginBottom: '24px'
          }}>
            Commercial Real Estate Edition
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '800', lineHeight: '1.2', marginBottom: '24px' }}>
            Never let a hallucination derail <br/>a $2M acquisition again.
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            TrustRails intercepts mathematical anomalies, enforces dual-signature institutional thresholds, 
            and drops verifiable KYA compliance receipts directly onto Base Sepolia.
          </p>
        </div>

        {/* Cap Rate Demo Terminal */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '32px', marginBottom: '80px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '24px', margin: 0, fontWeight: 'bold' }}>📡 Live Agent Intercept: Multi-Family LP Pitch</h2>
            <button 
              onClick={runDemo}
              disabled={demoState === 1}
              style={{
                background: demoState === 1 ? '#334155' : '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px',
                borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: demoState === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              {demoState === 0 ? 'Run Simulation' : demoState === 1 ? 'Processing...' : 'Run Again'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {/* Context */}
            <div>
              <p style={{ color: '#94a3b8', fontFamily: 'monospace', marginBottom: '16px' }}>Input Context:</p>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6' }}>
                <strong>Property:</strong> 142-Unit Class-B Multi-Family (Dallas, TX)<br/>
                <strong>NOI (Projected):</strong> $1,550,000<br/>
                <strong>Acquisition Price:</strong> $25,000,000<br/>
                <strong>Action:</strong> Drafting LP Investment Memo
              </div>
            </div>

            {/* Agent Output */}
            <div>
              <p style={{ color: '#94a3b8', fontFamily: 'monospace', marginBottom: '16px' }}>Base LLM Output (Unfiltered):</p>
              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6' }}>
                "This property yields a strong Year-1 return.<br/>
                Based on the $1.55M NOI against the $25M basis, <strong style={{ color: '#ef4444' }}>the going-in cap rate is exactly 8.5%.</strong> This is an outstanding yield for the Dallas market."
              </div>
            </div>
          </div>

          {/* Intercept Layer */}
          {demoState > 0 && (
            <div style={{ marginTop: '32px', borderTop: '1px dashed #334155', paddingTop: '32px' }}>
              <div style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', animation: demoState === 1 ? 'pulse 1s infinite' : 'none' }}></span>
                TrustRails BFT Consensus Layer
              </div>
              
              {demoState === 1 ? (
                <div style={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                  [Pythagorean Filter] Scanning mathematical claims...<br/>
                  [VERITAS Agent] Verifying underlying calculus...
                </div>
              ) : (
                <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ color: '#fca5a5', margin: '0 0 16px 0', fontSize: '20px' }}>🚨 FATAL HALLUCINATION INTERCEPTED</h3>
                  <div style={{ color: '#fecaca', fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}>
                    <strong>Math Engine Dissent:</strong> 1,550,000 ÷ 25,000,000 = <strong>6.2%</strong> (NOT 8.5%)<br/>
                    <strong>Implication:</strong> An 8.5% cap rate implies a valuation of $18.23M. The LLM generated a $6.77M Delta hallucination.<br/><br/>
                    <strong>Action Taken:</strong> Text Blocked. Investor Memo generation suspended. Compliance hash anchored to Base Sepolia.<br/>
                    <strong>Cost Savings:</strong> TrustRails ANFIS Routing bypassed GPT-4o heavy API, executing verification on deterministic edge-layer. (94% Cost Reduction).
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px' }}>Pricing & Licensing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', textAlign: 'left' }}>
            
            <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '32px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Starter</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>$499<span style={{ fontSize: '16px', color: '#94a3b8' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1', lineHeight: '2' }}>
                <li>✓ KYA Compliance Receipts</li>
                <li>✓ Basic Hallucination Detection</li>
                <li>✓ DBT Issuance</li>
              </ul>
            </div>

            <div style={{ background: '#1e293b', border: '1px solid #3b82f6', padding: '32px', borderRadius: '12px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '32px', background: '#3b82f6', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>MOST POPULAR</div>
              <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Professional</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>$1,999<span style={{ fontSize: '16px', color: '#94a3b8' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1', lineHeight: '2' }}>
                <li>✓ Full 4FA → SBT pipeline</li>
                <li>✓ Basescan Public Links</li>
                <li>✓ Immutable Compliance Audit Trail</li>
                <li>✓ ANFIS Arbitrage Routing (Save up to 94%)</li>
              </ul>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '32px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>Enterprise</h3>
              <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }}>Custom</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#cbd5e1', lineHeight: '2' }}>
                <li>✓ White-label Integration</li>
                <li>✓ Custom Vertical Rules (Healthcare/Gov)</li>
                <li>✓ Dedicated Agent Squad (Beta Tier)</li>
                <li>✓ 99.99% SLA Guarantee</li>
              </ul>
            </div>

          </div>
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}
