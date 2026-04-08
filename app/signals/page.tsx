"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Signal = {
  id: string;
  category: string;
  display_name: string;
  description: string;
  circle_position?: string;
};

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [liveSignals, setLiveSignals] = useState<Set<string>>(new Set());
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load toggles
    const saved = localStorage.getItem('trusttrader_signals_toggles');
    if (saved) {
      try {
        setToggles(JSON.parse(saved));
      } catch (e) {}
    }

    async function load() {
      const { data } = await supabase
        .from('signal_library')
        .select('*')
        .order('category')
        .order('display_name');
      
      if (data) setSignals(data);

      try {
        const { data: liveData } = await supabase.from('trusttrader_signals').select('signal_id');
        if (liveData) {
          setLiveSignals(new Set(liveData.map(d => d.signal_id)));
        }
      } catch(e) {}
    }
    load();
  }, []);

  const handleToggle = (id: string) => {
    const next = { ...toggles, [id]: !toggles[id] };
    setToggles(next);
    localStorage.setItem('trusttrader_signals_toggles', JSON.stringify(next));
  };

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: prev[cat] === false ? true : false }));
  };

  const categories = Array.from(new Set(signals.map(s => s.category)));
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = signals.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Signal[]>);

  const catColor = (cat: string) => {
    switch (cat) {
      case 'Sentiment': return 'bg-[#3b82f6]/20 text-[#3b82f6] border-[#3b82f6]/30';
      case 'On-Chain': return 'bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/30';
      case 'Macro': return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30';
      case 'Technical': return 'bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0f1e] text-[#f8fafc] font-sans">
      {/* Top bar matching terminal */}
      <header className="flex items-center px-4 shrink-0" style={{ height: 41, background: "#0d1424", borderBottom: "1px solid #1e293b" }}>
        <Link href="/trade" className="text-[#94a3b8] hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">
          ← Return to Terminal
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 overflow-y-auto">
        <div className="mb-10 border-b border-[#1e293b] pb-6">
          <h1 className="text-3xl font-bold font-mono tracking-tight mb-2">Signal Library — 37 Constitutional Trading Signals</h1>
          <p className="text-[#94a3b8] font-mono text-sm tracking-wide">Select 3-12 signals for your agent to monitor.</p>
        </div>

        <div className="space-y-6">
          {categories.map(cat => {
            const isExpanded = expandedCats[cat] !== false; // Default true
            const catSignals = grouped[cat];

            return (
              <div key={cat} className="border border-[#1e293b] bg-[#0d1424] rounded overflow-hidden">
                <button 
                  onClick={() => toggleCat(cat)}
                  className="w-full flex items-center justify-between p-4 bg-[#111827] hover:bg-[#1f2937] transition-colors border-b border-[#1e293b]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold uppercase tracking-widest text-sm text-[#e2e8f0]">{cat}</span>
                    <span className="font-mono text-xs text-[#475569]">{catSignals.length} signals</span>
                  </div>
                  <span className="text-[#64748b]">{isExpanded ? '▼' : '►'}</span>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-[#1e293b]">
                    {catSignals.map(s => (
                      <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center gap-4 bg-[#0a0f1e] hover:bg-[#0f172a] transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-white text-sm">{s.display_name}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${catColor(s.category)}`}>
                              {s.category}
                            </span>
                            {liveSignals.has(s.id) && (
                              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-mono border border-green-500/20">
                                LIVE
                              </span>
                            )}
                            {s.circle_position && (
                              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-mono border border-amber-500/20">
                                Pos: {s.circle_position}
                              </span>
                            )}
                          </div>
                          <p className="text-[#94a3b8] text-xs leading-relaxed max-w-2xl">
                            {s.description}
                          </p>
                        </div>
                        
                        <div className="shrink-0 flex items-center">
                          <button
                            onClick={() => handleToggle(s.id)}
                            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                            style={{ background: toggles[s.id] ? '#10b981' : '#334155' }}
                          >
                            <span 
                              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                              style={{ transform: toggles[s.id] ? 'translateX(24px)' : 'translateX(4px)' }}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {signals.length === 0 && (
            <div className="text-[#475569] font-mono text-center py-10 animate-pulse">Loading core Constitutional signals...</div>
          )}
        </div>
      </main>
    </div>
  );
}
