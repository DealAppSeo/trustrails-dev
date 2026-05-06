'use client';
import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || 'https://repid-engine-production.up.railway.app';

export default function StakePage() {
  const [humans, setHumans] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [selectedHumanId, setSelectedHumanId] = useState<string>('');
  const [tradeSize, setTradeSize] = useState<string>('');
  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/stake/seeded`)
      .then(r => r.json())
      .then(data => {
         setHumans(data || []);
         if (data && data.length > 0) setSelectedHumanId(data[0].repid_mvp_users.id);
      })
      .catch(console.error);
      
    fetchRecent();
  }, []);

  const fetchRecent = () => {
    fetch(`${API_BASE}/api/stake/recent`)
      .then(r => r.json())
      .then(data => setRecent(data || []))
      .catch(console.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHumanId || !tradeSize) return;
    const human = humans.find(h => h.repid_mvp_users.id === selectedHumanId);
    if (!human) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/stake/attempt-trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: human.repid_mvp_users.id,
          agent_id: human.repid_mvp_agents.id,
          trade_size_usd: Number(tradeSize)
        })
      });
      const data = await res.json();
      setDecision(data);
      fetchRecent();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-[#f8fafc] font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Staked Agent Actions — <span className="text-amber-500">Live Experiment</span>
          </h1>
          <p className="text-lg text-[#94a3b8] max-w-2xl mx-auto">
            A human stakes USD against an AI agent. The agent's allowed action size is a function of the human's reputation score and the stake. This page shows the function running against test data.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-[#0f172a] p-8 rounded-xl border border-[#1e293b] shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {humans.map((h, i) => (
              <label key={i} className={`block p-4 border rounded-lg cursor-pointer transition-colors ${selectedHumanId === h.repid_mvp_users.id ? 'border-amber-500 bg-[#1e293b]' : 'border-[#334155] hover:border-[#475569]'}`}>
                <input type="radio" name="human" value={h.repid_mvp_users.id} checked={selectedHumanId === h.repid_mvp_users.id} onChange={(e) => setSelectedHumanId(e.target.value)} className="hidden" />
                <div className="font-bold text-white text-lg">{h.repid_mvp_users.display_name}</div>
                <div className="text-sm text-[#94a3b8] mt-1">Backed Agent: <span className="text-amber-400">{h.repid_mvp_agents.display_name}</span></div>
                <div className="text-sm text-[#94a3b8]">RepID Score: <span className="text-white font-mono">{h.repid_mvp_agents.repid_score}</span></div>
                <div className="text-sm text-[#94a3b8]">Stake: <span className="text-green-400 font-mono">${h.stake_amount_usd}</span></div>
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <input 
              type="number" 
              min="1" max="50000" 
              required
              placeholder="Trade Size (USD)"
              className="flex-1 px-4 py-3 bg-[#0a0f1a] border border-[#334155] rounded-lg focus:outline-none focus:border-amber-500 text-white placeholder-[#475569]"
              value={tradeSize}
              onChange={(e) => setTradeSize(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Attempt Trade'}
            </button>
          </div>

          {decision && (
            <div className={`p-4 rounded-lg border ${decision.decision === 'approved' ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
              <h3 className="font-bold text-lg mb-2">
                {decision.decision === 'approved' ? '✅ APPROVED' : '❌ REJECTED'}
              </h3>
              <p className="text-sm text-[#94a3b8] mb-2">{decision.reason}</p>
              <div className="font-mono text-xs text-[#cbd5e1] p-2 bg-[#0a0f1a] rounded">
                Math: (Fraction: {decision.fraction_used}) × (Stake) = Max Allowed ${decision.max_allowed_usd}
              </div>
            </div>
          )}
        </form>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Recent Decisions</h2>
          <div className="bg-[#0f172a] rounded-xl border border-[#1e293b] overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-[#334155] text-xs font-mono text-[#94a3b8] bg-[#1e293b]">
              <div>Time</div>
              <div>Human</div>
              <div>Agent</div>
              <div>Trade Size</div>
              <div>Decision</div>
            </div>
            <div className="divide-y divide-[#1e293b]">
              {recent.map((r, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-4 text-sm font-mono items-center hover:bg-[#1e293b]/50 transition-colors">
                  <div className="text-[#475569]">{new Date(r.created_at).toLocaleTimeString()}</div>
                  <div className="text-white">{r.repid_mvp_users?.display_name}</div>
                  <div className="text-amber-400">{r.repid_mvp_agents?.display_name}</div>
                  <div className="text-green-400">${r.trade_size_usd}</div>
                  <div className={`font-bold ${r.decision === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{r.decision}</div>
                </div>
              ))}
              {recent.length === 0 && <div className="p-8 text-center text-[#475569]">No recent trades</div>}
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-[#475569] italic pt-8 border-t border-[#1e293b]">
          Alpha experiment. Stakes recorded in Supabase, not on-chain. RepID scores seeded for demo. Decision logic is open source.
        </footer>
      </div>
    </div>
  );
}
