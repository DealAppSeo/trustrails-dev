import Link from 'next/link';

export default function Home() {
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
        padding: '100px 32px',
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
          marginBottom: '32px'
        }}>
          StableHacks 2026 Submission
        </div>
        
        <h1 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1px' }}>
          The SSL Layer for the <br />Agentic Economy.
        </h1>
        
        <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px auto' }}>
          Banks have KYC for humans. TrustRails has KYA for agents. 
          A mathematically enforced oracle bridging AI autonomy to institutional compliance via 
          Solana Devnet, zero-knowledge proofs, and BFT consensus.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/dashboard" style={{
            background: '#1d4ed8',
            color: '#f1f5f9',
            padding: '16px 32px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '16px',
            textDecoration: 'none'
          }}>
            Launch Dashboard
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
        padding: '48px 32px 100px 32px'
      }}>
        {[
          { icon: '🔐', title: 'Absolute Liability', desc: 'DBT logic mapped strictly to SBTs to bind AI actions to real-world corporate liable entities.' },
          { icon: '⚖️', title: 'BFT Consensus', desc: 'No single LLM controls the network. Institutional transactions require distributed multi-model approval.' },
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
