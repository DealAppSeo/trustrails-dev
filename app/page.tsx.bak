import Link from 'next/link';
import { headers } from 'next/headers';
import { WaitlistForm } from './WaitlistForm';

export default function Home() {
  const headersList = headers();
  const host = headersList.get('host') || '';

  if (host.includes('trusttrader')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0f1e] text-center font-sans px-4 py-16">
        <h1 className="text-[72px] font-bold text-white leading-tight">TrustTrader</h1>
        <p className="text-[20px] text-[#94a3b8] font-mono uppercase tracking-wide mt-2">Constitutional AI Trading System</p>
        
        <div className="h-px bg-[#1e293b] w-full max-w-[400px] mx-auto my-12"></div>

        <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-16 mb-16">
          <div className="flex flex-col items-center">
            <span className="text-[36px] text-[#22c55e] font-mono">0%</span>
            <span className="text-[11px] text-[#475569] uppercase font-mono mt-2">MAX DRAWDOWN</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[36px] text-[#22c55e] font-mono">49.63%</span>
            <span className="text-[11px] text-[#475569] uppercase font-mono mt-2">WITHOUT VETO</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[36px] text-[#22c55e] font-mono">531441/524288</span>
            <span className="text-[11px] text-[#475569] uppercase font-mono mt-2">PYTHAGOREAN COMMA</span>
          </div>
        </div>

        <div className="bg-[#1c1407] border border-[#78350f] rounded p-6 w-full max-w-[480px] mx-auto mb-16 shadow-lg shadow-amber-900/10">
          <h2 className="text-[24px] font-bold text-[#f59e0b] mb-4">BEAT OUR AGENT</h2>
          <p className="text-[14px] text-[#94a3b8] mb-4">
            SOPHIA has issued 4 constitutional refusals.<br/>
            Drawdown: 0%. Can you beat her?
          </p>
          <p className="text-[14px] text-[#f8fafc] mb-6 font-semibold">
            Beat SOPHIA's 30-day P&L → Win Full tier<br/>
            for life ($499/mo value)
          </p>
          <Link href="/trade" className="inline-block bg-[#f59e0b] text-[#0a0f1e] px-8 py-3 rounded font-bold text-[16px] hover:bg-[#d97706] transition-colors">
            Enter the Challenge →
          </Link>
        </div>

        <div className="mb-16">
          <p className="text-[14px] text-[#94a3b8] text-center mb-4">Join the waitlist for early access</p>
          <WaitlistForm />
        </div>

        <div className="text-[12px] text-[#475569] font-mono text-center mb-16 leading-relaxed">
          🏆 Submitted to LabLab AI Trading Agents<br/>
          Hackathon — April 2026 — $55K Prize Pool
        </div>

        <div className="mb-4 flex flex-col items-center">
          <Link href="/trade" className="inline-block border border-[#1d4ed8] text-[#93c5fd] px-6 py-2.5 rounded hover:bg-[#1d4ed8]/20 transition-colors">
            Launch Terminal →
          </Link>
          <div className="text-[#334155] text-[12px] mt-3 tracking-widest">trusttrader.dev/trade</div>
        </div>

        <footer className="text-[11px] text-[#334155] mt-auto pb-4">
          Powered by RepID · HyperDAG Protocol · ERC-8004 on Base Sepolia
        </footer>
      </div>
    );
  }

  return (
    <div style={{
      background: '#020817',
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
            TR
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>TrustRails</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/cre-license" style={{ color: '#10b981', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            CRE License
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
        <div style={{
          display: 'inline-block',
          background: '#1e293b',
          padding: '6px 16px',
          borderRadius: '24px',
          fontSize: '13px',
          fontWeight: 'bold',
          marginBottom: '24px'
        }}>
          StableHacks 2026 Submission
        </div>
        
        <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
          The SSL Layer for the <br />Agentic Economy.
        </h1>
        
        <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '24px', maxWidth: '700px', margin: '0 auto' }}>
          Banks have KYC for humans. TrustRails has KYA for agents. 
          A mathematically enforced oracle bridging AI autonomy to institutional compliance via 
          Solana Devnet, zero-knowledge proofs, and BFT consensus.
        </p>

        <div style={{ marginTop: '40px' }}>
          <Link href="/demo" style={{
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
            Live Trust Ceremony Demo →
          </Link>
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
        fontFamily: 'monospace'
      }}>
        🔒 Proprietary Technology · Patent Portfolio Pending (P-001–P-028)
      </div>
    </div>
  );
}
