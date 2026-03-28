import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#020817] text-slate-200 overflow-hidden font-sans">
      {/* Dynamic Background Glowing Meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-emerald-900/20 via-cyan-900/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-900/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-white font-bold text-sm">TR</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TrustRails</span>
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Enter Dashboard
          </Link>
          <a href="https://github.com/DealAppSeo/trustrails-dev" target="_blank" rel="noreferrer" className="px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
            View Source
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-32 pb-24 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          StableHacks 2026 Submission
        </div>
        
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white">
          The SSL Layer for the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 drop-shadow-sm">
            Agentic Economy.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Banks have KYC for humans. TrustRails has KYA for agents. 
          A mathematically enforced oracle bridging AI autonomy to institutional compliance via 
          Solana Devnet, zero-knowledge proofs, and BFT consensus.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/dashboard" className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:scale-105 transition-all duration-300 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] flex items-center justify-center gap-2">
            Launch Institutional Dashboard
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <a href="/api/trustrails/demo" target="_blank" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 group">
            Run Golden Hash Demo
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">⚡</span>
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: '🔐', title: 'Absolute Liability', desc: 'DBT logic mapped strictly to SBTs to bind AI actions to real-world corporate liable entities.' },
          { icon: '⚖️', title: 'BFT Consensus', desc: 'No single LLM controls the network. Institutional transactions require distributed multi-model approval.' },
          { icon: '⚡', title: 'Solana L1 Settlement', desc: 'Every authorized transaction natively executes on-chain with compact encoded compliance memos.' }
        ].map((feat, i) => (
          <div key={i} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors">
            <div className="text-3xl mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
