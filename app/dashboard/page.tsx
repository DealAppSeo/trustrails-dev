import { SystemTrustScore } from '@/components/trustrails/SystemTrustScore';
import { AgentRepIDGrid }   from '@/components/trustrails/AgentRepIDGrid';
import { LiveReceiptFeed }  from '@/components/trustrails/LiveReceiptFeed';
import { RiskSlider }       from '@/components/trustrails/RiskSlider';
import { InstitutionalControls } from '@/components/trustrails/InstitutionalControls';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020817] to-[#020817] z-0" />

      <div className="relative z-10 p-6 md:p-8 max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <span className="text-white font-bold text-xl">TR</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">TrustRails Control Matrix</h1>
              <p className="text-slate-400 text-sm mt-1">Enterprise Agentic Compliance Gateway</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <a href="/api/trustrails/demo/villain" target="_blank" rel="noreferrer"
               className="group flex items-center gap-2 bg-red-950/30 text-red-400 border border-red-900/50 rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-red-900/40 hover:border-red-500/50 transition-all shadow-lg shadow-red-900/10">
              <span className="group-hover:scale-110 transition-transform">⛔</span> Run Guardrail Demo
            </a>
            <a href="/api/trustrails/demo" target="_blank" rel="noreferrer"
               className="group flex items-center gap-2 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-emerald-900/40 hover:border-emerald-500/50 transition-all shadow-lg shadow-emerald-900/10">
              <span className="group-hover:animate-pulse">⚡</span> Run Compliance Demo
            </a>
          </div>
        </header>

        {/* System Trust Score */}
        <div className="mb-10 w-full animate-in fade-in slide-in-from-top-4 duration-700">
          <SystemTrustScore />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
          
          {/* Left Column: Controls & Agents */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Institutional Risk Configuration
              </h2>
              <RiskSlider />
            </div>
            
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex-grow">
              <AgentRepIDGrid />
            </div>
          </div>

          {/* Right Column: Feed & Limits */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
              <InstitutionalControls institutionId="default" />
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl backdrop-blur-xl shadow-xl flex-grow overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/5 bg-slate-800/20">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Compliance Feed
                </h2>
              </div>
              <div className="flex-grow">
                <LiveReceiptFeed />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Badges */}
        <footer className="flex flex-wrap justify-center gap-4 py-8 border-t border-white/5">
          {['MiCA Compliant', 'GENIUS Act Ready', 'FATF Rec. 16 Aligned', 'Fireblocks Pre-Auth', 'AMINA Bank Pilot Ready'].map(label => (
            <div key={label} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              {label}
            </div>
          ))}
        </footer>

      </div>
    </div>
  );
}
