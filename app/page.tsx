import Link from 'next/link';
import { headers } from 'next/headers';
import { WaitlistForm } from './WaitlistForm';

export default async function Home() {
  const headersList = await headers();
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
          <Link href="/suite" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: '15px', fontWeight: 'bold' }}>
            Trust Suite
          </Link>
          <Link href="/dashboard" style={{ color: '#f1f5f9', textDecoration: 'none', fontSize: '15px' }}>
            Enter Dashboard
          </Link>
          <a href="https://trusttrader.dev/trade" style={{
            background: '#f59e0b',
            color: '#0a0f1e',
            fontWeight: 'bold',
            fontSize: '15px',
            padding: '8px 16px',
            borderRadius: '6px',
            textDecoration: 'none'
          }}>
            Enter Terminal →
          </a>
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
        padding: '80px 32px 48px 32px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          color: '#818cf8',
          padding: '6px 18px',
          borderRadius: '24px',
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '24px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Coming Soon &middot; Compliance Infrastructure
        </div>
        
        <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
          Compliance Infrastructure for <br />
          <span style={{ background: 'linear-gradient(to right, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Autonomous AI Agent Transactions
          </span>
        </h1>
        
        <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px', maxWidth: '700px', margin: '0 auto' }}>
          Banks have KYC for humans. TrustRails has KYA (Know Your Agent). A mathematically enforced compliance oracle bridging autonomous AI agent execution to institutional auditability.
        </p>

        {/* Waitlist Box */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '540px',
          margin: '0 auto 40px auto',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
        }}>
          <p style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '16px', fontWeight: '600' }}>
            Join the waitlist for compliant L1 settlement access
          </p>
          <WaitlistForm />
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/demo" style={{
            display: 'inline-block',
            background: 'linear-gradient(to right, #10b981, #059669)',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '14px 28px',
            borderRadius: '10px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease',
          }}>
            Live Trust Ceremony Demo &rarr;
          </Link>
          <Link href="/dashboard" style={{
            display: 'inline-block',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f1f5f9',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '14px 28px',
            borderRadius: '10px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}>
            Enter Dashboard
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
            background: 'rgba(30, 41, 59, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)',
            padding: '32px',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '28px', marginBottom: '16px' }}>{feat.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>{feat.title}</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Tech Stack Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '48px'
      }}>
        {[
          '⚡ Solana — Settlement &middot; 400ms &middot; $0.00025/tx',
          '🔷 Base Sepolia — Identity &middot; ERC-8004',
          '💱 x402 — Agent-to-Agent Payments',
          '🔗 HyperDAG — Reputation DAG'
        ].map((badge, i) => (
          <div key={i} style={{
            background: 'rgba(30, 41, 59, 0.5)',
            color: '#94a3b8',
            fontSize: '12px',
            fontFamily: 'monospace',
            padding: '8px 14px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px'
          }} dangerouslySetInnerHTML={{ __html: badge }}>
          </div>
        ))}
      </div>

      {/* Unified Footer */}
      <footer style={{
        borderTop: '1px solid #1e293b',
        padding: '48px 24px',
        background: '#020817',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
            ━━━ HyperDAG Trust Layer ━━━
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', fontSize: '13px', fontWeight: '600' }}>
            <a href="https://trustchat.dev" style={{ color: '#94a3b8', textDecoration: 'none' }}>TrustChat</a>
            <span style={{ color: '#334155' }}>&middot;</span>
            <a href="https://trustshell.dev" style={{ color: '#94a3b8', textDecoration: 'none' }}>TrustShell</a>
            <span style={{ color: '#334155' }}>&middot;</span>
            <a href="https://trustrepid.dev" style={{ color: '#94a3b8', textDecoration: 'none' }}>TrustRepID</a>
            <span style={{ color: '#334155' }}>&middot;</span>
            <a href="https://trustchat.dev/leaderboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Leaderboard</a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '12px', fontWeight: '500', color: '#475569' }}>
            <span>Coming Soon:</span>
            <a href="https://trustrails.dev" style={{ color: '#f1f5f9', textDecoration: 'none' }}>TrustRails</a>
            <span style={{ color: '#334155' }}>&middot;</span>
            <a href="https://trustmarket.dev" style={{ color: '#64748b', textDecoration: 'none' }}>TrustMarket</a>
            <span style={{ color: '#334155' }}>&middot;</span>
            <a href="https://trustcre.dev" style={{ color: '#64748b', textDecoration: 'none' }}>TrustCRE</a>
            <span style={{ color: '#334155' }}>&middot;</span>
            <a href="https://hyperdag.org" style={{ color: '#64748b', textDecoration: 'none' }}>HyperDAG.org</a>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
            <span>Powered by HAL &middot; ERC-8004 &middot; Apache-2.0</span>
            <span>&middot;</span>
            <a href="https://github.com/DealAppSeo" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none' }}>github.com/DealAppSeo</a>
            <span>&middot;</span>
            <span style={{ fontStyle: 'italic' }}>Micah 6:8</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
