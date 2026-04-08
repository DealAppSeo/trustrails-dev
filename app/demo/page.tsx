'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qnnpjhlxljtqyigedwkb.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function ProtocolDemo() {
  const [totalDecisions, setTotalDecisions] = useState(0);
  const [refusedCount, setRefusedCount] = useState(0);
  const [feed, setFeed] = useState<any[]>([]);
  const [signals, setSignals] = useState({ fg: '--', btc: '--', rsi: '--' });
  const [repIdScore, setRepIdScore] = useState(9995);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  useEffect(() => {
    // Initial fetch
    const fetchStats = async () => {
      // Get all decisions
      const { data: decisions } = await supabase
        .from('trade_execution_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (decisions) {
        setTotalDecisions(decisions.length);
        setRefusedCount(decisions.filter((d: any) => d.decision === 'REFUSED').length);
        setFeed(decisions.slice(0, 8));
      }

      // Get signals
      const { data: sigData } = await supabase
        .from('trusttrader_signals')
        .select('*');

      if (sigData) {
        const fg = sigData.find(s => s.name.includes('Fear'))?.value || '72';
        const btc = sigData.find(s => s.name.includes('BTC') || s.name.includes('Price'))?.value || '64,250';
        const rsi = sigData.find(s => s.name.includes('RSI'))?.value || '68';
        setSignals({ fg, btc, rsi });
      }
    };

    fetchStats();

    // Subscribe to realtime executions
    const channel = supabase.channel('demo_feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trade_execution_log' }, (payload) => {
        setTotalDecisions(prev => prev + 1);
        if (payload.new.decision === 'REFUSED') {
          setRefusedCount(prev => prev + 1);
        }
        setFeed(prev => [payload.new, ...prev].slice(0, 8));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, source: 'trusttrader_demo' }]);
    if (error) setStatus('error');
    else setStatus('success');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-[#f8fafc] font-sans overflow-x-hidden">
      {/* Signal Strip */}
      <div className="bg-[#1e293b] text-xs font-mono py-2 border-b border-[#334155] flex justify-center space-x-6 text-amber-500">
        <span>Fear/Greed: {signals.fg}</span>
        <span className="text-[#475569]">|</span>
        <span>BTC: ${signals.btc}</span>
        <span className="text-[#475569]">|</span>
        <span>RSI: {signals.rsi}</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        
        {/* SECTION 1 - LIVE PROOF */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            AI agents that refuse bad trades — <br/>
            <span className="text-amber-500">and prove it on-chain.</span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
            SOPHIA has made <span className="text-white font-mono">{totalDecisions}</span> constitutional decisions.{' '}
            <span className="text-amber-500 font-mono">{refusedCount}</span> trades refused. Capital preserved.
          </p>

          <div className="mt-12 bg-[#0f172a] border border-[#1e293b] rounded-lg overflow-hidden text-left shadow-2xl">
            <div className="bg-[#1e293b] px-4 py-2 border-b border-[#334155] text-xs font-mono text-[#94a3b8]">Live Execution Log (Last 8)</div>
            <div className="p-4 space-y-3 font-mono text-xs">
              {feed.map((log, i) => (
                <div key={log.id || i} className="flex items-center space-x-4 border-b border-[#1e293b] pb-2 last:border-0 last:pb-0 animate-fade-in-down">
                  <span className="text-[#475569] shrink-0 w-20">
                    {new Date(log.created_at).toLocaleTimeString([], { hour12: false })}
                  </span>
                  <span className={`shrink-0 w-20 font-bold ${log.decision === 'REFUSED' ? 'text-amber-500' : 'text-green-500'}`}>
                    {log.decision}
                  </span>
                  <span className="shrink-0 w-16 text-[#94a3b8]">{(log.unity_score || 0).toFixed(4)}</span>
                  <span className="truncate flex-1 text-[#cbd5e1]">{log.reason}</span>
                  {log.tx_hash && (
                    <a href={`https://basescan.org/tx/${log.tx_hash}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 shrink-0">
                      View Tx ↗
                    </a>
                  )}
                </div>
              ))}
              {feed.length === 0 && <div className="text-center text-[#475569] py-4">Awaiting signal inputs...</div>}
            </div>
          </div>
        </section>

        {/* SECTION 2 - THREE LAYER EXPLAINER */}
        <section className="space-y-12 py-12 border-t border-b border-[#1e293b]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Box 1 */}
            <div className="relative group bg-[#0f172a] border border-[#334155] hover:border-amber-500 transition-colors p-6 rounded-xl flex-1 text-center h-48 flex flex-col justify-center shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-[#0a0f1a] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                SOPHIA RepID: {repIdScore} / 10,000 — Conservator-backed — up to $250 coverage
              </div>
              <div className="text-3xl mb-3">✉️</div>
              <h3 className="font-bold text-white mb-2">POSTCARD</h3>
              <p className="text-sm text-[#94a3b8]">Fast ZKP check. Proves agent has standing. Sub-second. Free.</p>
            </div>

            <div className="hidden md:block text-[#475569] text-2xl font-light">→</div>
            
            {/* Box 2 */}
            <div className="bg-[#0f172a] border border-[#334155] p-6 rounded-xl flex-1 text-center h-48 flex flex-col justify-center">
              <div className="text-3xl mb-3">📨</div>
              <h3 className="font-bold text-white mb-2">ENVELOPE</h3>
              <p className="text-sm text-[#94a3b8]">Verified data exchange. Constitutional rules + decision history. Gated by RepID.</p>
            </div>

            <div className="hidden md:block text-[#475569] text-2xl font-light">→</div>

            {/* Box 3 */}
            <div className="bg-[#0f172a] border border-[#334155] p-6 rounded-xl flex-1 text-center h-48 flex flex-col justify-center">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-bold text-white mb-2">PACKAGE</h3>
              <p className="text-sm text-[#94a3b8]">Sovereign encrypted data. Tax records, full history. Only you hold the keys.</p>
            </div>

          </div>
          <p className="text-center text-[#94a3b8] italic">
            "ZKP RepID is the mesh that makes ERC-8004 identity useful and x402 payments safe."
          </p>
        </section>

        {/* SECTION 3 - TRY IT */}
        <section className="text-center max-w-lg mx-auto pb-24">
          <h2 className="text-2xl font-bold text-white mb-6">Experience the Protocol</h2>
          
          <form onSubmit={handleWaitlist} className="space-y-4">
            <input 
              type="email" 
              required
              placeholder="Enter email to begin"
              className="w-full px-4 py-3 bg-[#0a0f1a] border border-[#334155] rounded-lg focus:outline-none focus:border-amber-500 text-white placeholder-[#475569] text-center"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'success'}
            />
            <button 
              type="submit" 
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50"
            >
              {status === 'loading' ? 'Processing...' : status === 'success' ? 'Welcome to TrustTrader' : 'Watch SOPHIA trade for you →'}
            </button>
          </form>

          {status === 'error' && <p className="text-red-400 text-sm mt-4">Failed to join waitlist. Please try again.</p>}
          <p className="text-xs text-[#475569] mt-6">
            No wallet needed. Paper trading only. Your first decision creates your on-chain credential.
          </p>
        </section>

      </div>
    </div>
  );
}
