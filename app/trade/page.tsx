"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const RISK_PROFILES = [
  { id: 'very_conservative', label: 'Very Conservative', threshold: 0.01205 },
  { id: 'conservative', label: 'Conservative', threshold: 0.01560 },
  { id: 'moderate', label: 'Moderate', threshold: 0.01950, note: '(Pythagorean Comma baseline)' },
  { id: 'aggressive', label: 'Aggressive', threshold: 0.03155 },
  { id: 'very_aggressive', label: 'Very Aggressive', threshold: 0.05108 }
];

const SIGNALS = [
  { pos: 0, note: 'C', name: 'Fear & Greed Index' },
  { pos: 1, note: 'G', name: 'Whale Alert' },
  { pos: 2, note: 'D', name: 'On-Chain Health' },
  { pos: 3, note: 'A', name: 'BTC Price' },
  { pos: 4, note: 'E', name: 'RSI' },
  { pos: 5, note: 'B', name: 'Volume Spike' },
  { pos: 6, note: 'F#', name: 'Exchange Sentiment' },
  { pos: 7, note: 'C#', name: 'News Sentiment' },
  { pos: 8, note: 'G#', name: 'Interest Rates' },
  { pos: 9, note: 'D#', name: 'Inflation' },
  { pos: 10, note: 'A#', name: 'Guru Consensus' },
  { pos: 11, note: 'F', name: 'ETF Flow' },
  { pos: 12, note: 'C', name: 'Congressional Trading (Judas)', isAntagonist: true }
];

export default function TradePage() {
  const [profile, setProfile] = useState(RISK_PROFILES[2]);
  const [repId, setRepId] = useState<number>(8500); // Earned/10000 = Logic
  const [perceivedRepId, setPerceivedRepId] = useState<number>(8500);
  
  const chaos = 0.820; // ANFIS confidence stub
  const dissonance = 0.0124; // dissonance stub
  const beauty = 1 - dissonance;
  
  const logic = repId / 10000;
  
  // (Logic × Chaos × Beauty)^(1/φ)
  const phi = 1.61803398875;
  const unityScore = Math.pow(logic * chaos * beauty, 1 / phi);

  useEffect(() => {
    // Fetch live RepID for SOPHIA
    const fetchRepId = async () => {
      const { data, error } = await supabase
        .from('agent_repid')
        .select('earned_repid, perceived_repid')
        .eq('agent_name', 'SOPHIA')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!error && data && data.length > 0) {
        setRepId(data[0].earned_repid || 8500);
        setPerceivedRepId(data[0].perceived_repid || 8500);
      }
    };
    fetchRepId();
    
    // Subscribe to changes
    const channel = supabase.channel('agent_repid_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_repid', filter: "agent_name=eq.'SOPHIA'" }, payload => {
        setRepId(payload.new.earned_repid);
        setPerceivedRepId(payload.new.perceived_repid);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Generate stub values for the 13 signals
  const [signalValues] = useState(() => 
    SIGNALS.map(s => ({
      ...s,
      value: s.isAntagonist ? -0.8 : (Math.random() * 2 - 0.5) // Random values between -0.5 and 1.5, antagonist negative
    }))
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 font-sans p-8">
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">TrustTrader</h1>
        <p className="text-slate-400">Institutional AI Agent Finance</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Risk Profile Selector */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Risk Profile</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {RISK_PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => setProfile(p)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  profile.id === p.id 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                } border`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="text-slate-400 font-mono text-sm space-y-1">
            <p>Effective Comma Threshold: <span className="text-blue-400">{profile.threshold}</span> {profile.note}</p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Circle of Fifths */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-8 text-slate-200">Harmonic Resonance</h2>
            
            <div className="relative w-64 h-64 mb-8">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                {/* Background circle */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1e293b" strokeWidth="4" />
                
                {signalValues.map((signal, i) => {
                  if (signal.isAntagonist) {
                    // Position 12 (Judas) - slightly outside top (Position 0)
                    const angle = -Math.PI / 2; // Top
                    const r = 95; // Outside main circle
                    const x = 100 + r * Math.cos(angle);
                    const y = 100 + r * Math.sin(angle);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="6" fill="#ef4444" className="animate-pulse" />
                        <text x={x + 12} y={y + 4} fill="#ef4444" fontSize="8" fontFamily="monospace">Judas</text>
                      </g>
                    );
                  }

                  // 12 positions
                  const angle = (signal.pos * 30 - 90) * (Math.PI / 180);
                  const r = 80;
                  const x = 100 + r * Math.cos(angle);
                  const y = 100 + r * Math.sin(angle);
                  
                  const isBullish = signal.value > 0;
                  const color = isBullish ? '#34d399' : '#ef4444';

                  return (
                    <g key={i}>
                      {/* Note Label */}
                      <text 
                        x={100 + (r+15) * Math.cos(angle)} 
                        y={100 + (r+15) * Math.sin(angle)} 
                        fill="#64748b" 
                        fontSize="10" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                      >
                        {signal.note}
                      </text>
                      {/* Signal Dot */}
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="6" 
                        fill={color} 
                        className="transition-all duration-500" 
                      />
                      {/* Name tooltip fallback via title */}
                      <title>{signal.name}: {signal.value.toFixed(2)}</title>
                    </g>
                  );
                })}

                {/* Center text */}
                <text x="100" y="95" fill="#94a3b8" fontSize="10" textAnchor="middle">Dissonance</text>
                <text x="100" y="115" fill="#f8fafc" fontSize="16" fontWeight="bold" fontFamily="monospace" textAnchor="middle">{dissonance.toFixed(4)}</text>
              </svg>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-2">Unity Score</div>
              <div className={`text-5xl font-mono font-bold ${unityScore > 0.95 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {unityScore.toFixed(3)}
              </div>
            </div>
          </section>

          {/* Stats & PoR Feed */}
          <div className="space-y-8">
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-slate-200">Harmonic Components</h2>
              
              <div className="space-y-4 mb-6 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Logic (RepID / 10000)</span>
                  <span className="text-white text-lg">{logic.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Chaos (ANFIS Conf.)</span>
                  <span className="text-white text-lg">{chaos.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Beauty (1 - Dissonance)</span>
                  <span className="text-white text-lg">{beauty.toFixed(3)}</span>
                </div>
              </div>

              <div className="p-4 bg-black/40 rounded-lg">
                <div className="text-xs text-slate-500 mb-1 uppercase font-bold">Formula</div>
                <div className="text-blue-400 font-mono text-sm">(Logic × Chaos × Beauty)^(1/φ)</div>
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-200">Agent Performance</h2>
                <span className="px-3 py-1 bg-blue-900/50 text-blue-400 border border-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">Sophia</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-sm text-slate-400 mb-1">Earned RepID</div>
                  <div className="text-2xl font-mono text-white">{repId}</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-sm text-slate-400 mb-1">Perceived RepID</div>
                  <div className="text-2xl font-mono text-indigo-400">{perceivedRepId}</div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Proof of Refusal</h3>
              <div className="space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <span className="font-mono text-sm text-slate-300">TX-Refuse-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                    </div>
                    <span className="text-xs text-slate-500">{i * 2}m ago</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
