import Link from 'next/link';
import { SuiteWaitlistForm } from '../SuiteWaitlistForm';

export default function SuiteHome() {
  return (
    <div style={{
      background: '#0a0f1e', // matched from original design foundation but made strictly dark as requested
      color: '#f1f5f9',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      margin: 0,
      padding: 0
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '15px'
          }}>
            HD
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>HyperDAG Protocol</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/cre-license" style={{ color: '#10b981', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            CRE License
          </Link>
          <Link href="/suite" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            Trust Suite
          </Link>
          <Link href="/dashboard" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: '15px' }}>
            Enter Dashboard
          </Link>
          <a href="https://github.com/DealAppSeo/trustrails-dev" target="_blank" rel="noreferrer" style={{
            fontSize: '15px',
            padding: '8px 16px',
            border: '1px solid #1e293b',
            borderRadius: '6px',
            textDecoration: 'none',
            color: '#f1f5f9'
          }}>
            View Source
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{
        padding: '64px 32px 24px 32px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
          The Trust Layer for the <br />Agentic Economy.
        </h1>
        
        <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px', maxWidth: '700px', margin: '0 auto' }}>
          Private. Secure. Hallucination-Free. Built for humans and agents alike — so you and your AI can transact with confidence.
        </p>

        <div style={{ marginTop: '40px' }}>
          <a href="#suite" style={{
            display: 'inline-block',
            background: 'linear-gradient(to right, #10b981, #059669)',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '18px',
            padding: '16px 32px',
            borderRadius: '12px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)',
            transition: 'transform 0.2s ease',
          }}>
            Explore the Trust Suite ↓
          </a>
        </div>

      </main>

      {/* Feature Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 32px 64px 32px'
      }}>
        {[
          { icon: '⚖️', title: 'BFT Consensus', desc: 'No single LLM controls the network. Institutional transactions require distributed multi-model approval.' },
          { icon: '🔐', title: 'Verified Accountability', desc: 'Agent actions cryptographically bound to a verified responsible party — proven without being revealed. You set the requirement. We enforce it.' },
          { icon: '⚡', title: 'Solana L1 Settlement', desc: 'Every authorized transaction natively executes on-chain with compact encoded compliance memos.' }
        ].map((feat, i) => (
          <div key={i} style={{
            background: '#1e293b',
            padding: '32px',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '16px' }}>{feat.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', margin: '0 0 8px 0' }}>{feat.title}</h3>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Trust Suite Section */}
      <section id="suite" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px 32px 64px 32px',
        borderTop: '1px solid #1e293b',
        paddingTop: '64px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>The HyperDAG Trust Suite</h2>
          <p style={{ fontSize: '18px', color: '#94a3b8' }}>One trust layer. Four products. Every agent protected.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Card 1 - TrustRails */}
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              TrustRails
            </h3>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 24px 0', flex: 1 }}>
              <strong style={{ color: '#f1f5f9' }}>Institutional-Grade AI Governance</strong> · KYA compliance for AI agents. Constitutional rules, on-chain audit trails, and RepID behavioral scoring.
            </p>
            <Link href="/demo" style={{ display: 'inline-block', color: '#10b981', fontWeight: 'bold', textDecoration: 'none' }}>
              Enter Dashboard →
            </Link>
          </div>

          {/* Card 2 - TrustTrader */}
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              TrustTrader
              <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>LabLab Hackathon · $55K</span>
            </h3>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 24px 0', flex: 1 }}>
              <strong style={{ color: '#f1f5f9' }}>Hallucination-Free Trading · Patent Pending</strong> · Constitutional AI that proves what it refuses to trade. 13 signals. Pythagorean Comma veto. 0% drawdown vs 49.63% without.
            </p>
            <a href="https://trusttrader.dev/trade" style={{ display: 'inline-block', color: '#10b981', fontWeight: 'bold', textDecoration: 'none' }}>
              Enter Terminal →
            </a>
          </div>

          {/* Card 3 - TrustShell */}
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              TrustShell
              <span style={{ fontSize: '11px', background: '#334155', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coming Soon</span>
            </h3>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 24px 0', flex: 1 }}>
              <strong style={{ color: '#f1f5f9' }}>The Trust Wrapper for Your Agents</strong> · Drop-in constitutional protection for any AI agent. One SDK. Hallucination detection at the protocol level.
            </p>
            <a href="https://trustshell.dev" style={{ display: 'inline-block', color: '#10b981', fontWeight: 'bold', textDecoration: 'none' }}>
              View SDK →
            </a>
          </div>

          {/* Card 4 - TrustCRE */}
          <div style={{ background: '#1e293b', padding: '32px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              TrustCRE
              <span style={{ fontSize: '11px', background: '#334155', color: '#94a3b8', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Coming Soon</span>
            </h3>
            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 24px 0', flex: 1 }}>
              <strong style={{ color: '#f1f5f9' }}>The Trust Layer for Commercial Real Estate at the Speed of AI</strong> · AI-powered CRE intelligence with constitutional guardrails. Underwriting, risk analysis, hallucination-free.
            </p>
            <Link href="/demo" style={{ display: 'inline-block', color: '#10b981', fontWeight: 'bold', textDecoration: 'none' }}>
              Join Waitlist →
            </Link>
          </div>
        </div>

        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '32px', borderRadius: '12px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#f8fafc' }}>Be first to access the full Trust Suite.</p>
          <SuiteWaitlistForm />
        </div>
      </section>

      {/* Tech Stack Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}>
        {[
          '⚡ Solana — Settlement · 400ms · $0.00025/tx',
          '🔷 Base Sepolia — Identity · ERC-8004',
          '💱 x402 — Agent-to-Agent Payments',
          '🔗 HyperDAG — Reputation DAG'
        ].map((badge, i) => (
          <div key={i} style={{
            background: '#1e293b',
            color: '#64748b',
            fontSize: '12px',
            fontFamily: 'monospace',
            padding: '8px',
            border: '1px solid #334155',
            borderRadius: '4px'
          }}>
            {badge}
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: '13px',
        color: '#94a3b8',
        marginTop: '16px',
        fontFamily: 'monospace',
        paddingBottom: '32px'
      }}>
        <div style={{ marginBottom: '8px' }}>🔒 Proprietary Technology · Patent Portfolio Pending (P-001–P-028)</div>
        <div style={{ color: '#64748b' }}>HyperDAG Protocol · TrustRails · TrustTrader · TrustShell · TrustCRE</div>
      </div>
    </div>
  );
}
