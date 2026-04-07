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
  { pos: 12, note: 'C', name: 'Congressional Trading', isAntagonist: true }
];

export default function TradePage() {
  const [profile, setProfile] = useState(RISK_PROFILES[2]);
  const [repId, setRepId] = useState<number>(8500); 
  const [perceivedRepId, setPerceivedRepId] = useState<number>(8500);
  
  const chaos = 0.820; 
  const dissonance = 0.0124; 
  const beauty = 1 - dissonance;
  
  const logic = repId / 10000;
  
  const phi = 1.61803398875;
  const unityScore = Math.pow(logic * chaos * beauty, 1 / phi);

  useEffect(() => {
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

  const [signalValues] = useState(() => 
    SIGNALS.map(s => {
      let val = s.isAntagonist ? -0.8 : (Math.random() * 2 - 0.5);
      return { ...s, value: val };
    })
  );

  const getUnityColor = (score: number) => {
    if (score > 0.95) return 'border-[#22c55e] text-[#22c55e]';
    if (score >= 0.7) return 'border-[#f59e0b] text-[#f59e0b]';
    return 'border-[#ef4444] text-[#ef4444]';
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#f8fafc] font-sans p-8">
      <header className="max-w-5xl mx-auto mb-10 pb-4 border-b border-[#1e293b]">
        <h1 className="text-3xl font-bold mb-1">TrustTrader</h1>
        <p className="text-[#94a3b8] text-sm">Institutional AI Agent Finance Terminal</p>
      </header>

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Risk Profile Selector */}
        <section className="bg-[#1e293b] rounded p-6">
          <h2 className="text-sm uppercase tracking-wider font-semibold mb-4 text-[#f8fafc]">Constitutional Risk Threshold</h2>
          <div className="flex flex-wrap gap-3">
            {RISK_PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => setProfile(p)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors border ${
                  profile.id === p.id 
                    ? 'bg-[#3b82f6] text-[#f8fafc] border-[#3b82f6]' 
                    : 'bg-transparent text-[#94a3b8] border-[#334155] hover:border-[#94a3b8]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="text-[#94a3b8] font-mono text-xs mt-4">
            Threshold: <span className="text-[#f8fafc]">{profile.threshold}</span> {profile.note}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Signal Harmonic Map */}
          <section className="bg-[#1e293b] rounded p-6 flex flex-col items-center">
            <h2 className="text-sm uppercase tracking-wider font-semibold mb-6 text-[#f8fafc] self-start w-full border-b border-[#334155] pb-2">Signal Harmonic Map</h2>
            
            <div className="relative w-64 h-64 mb-4">
              <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                {/* Background circle */}
                <circle cx="100" cy="100" r="80" fill="none" stroke="#334155" strokeWidth="1" />
                
                {signalValues.map((signal, i) => {
                  if (signal.isAntagonist) {
                    const angle = -Math.PI / 2;
                    const r = 92;
                    const x = 100 + r * Math.cos(angle);
                    const y = 100 + r * Math.sin(angle);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="3" fill="#ef4444" className="animate-pulse" />
                        <title>⚠ Comma Antagonist</title>
                      </g>
                    );
                  }

                  const angle = (signal.pos * 30 - 90) * (Math.PI / 180);
                  const r = 80;
                  const x = 100 + r * Math.cos(angle);
                  const y = 100 + r * Math.sin(angle);
                  
                  let color = '#f59e0b'; // Amber neutral
                  if (signal.value > 0.1) color = '#22c55e'; // Green harmony
                  else if (signal.value < -0.1) color = '#ef4444'; // Red dissonance

                  return (
                    <g key={i}>
                      <text 
                        x={100 + (r+15) * Math.cos(angle)} 
                        y={100 + (r+15) * Math.sin(angle)} 
                        fill="#94a3b8" 
                        fontSize="5" 
                        fontFamily="monospace"
                        textAnchor="middle" 
                        dominantBaseline="middle"
                      >
                        {signal.note}
                      </text>
                      <circle cx={x} cy={y} r="3" fill={color} className="transition-all duration-500" />
                      <title>{signal.name}: {signal.value.toFixed(3)}</title>
                    </g>
                  );
                })}

                <text x="100" y="95" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">Dissonance:</text>
                <text x="100" y="105" fill="#f8fafc" fontSize="8" fontFamily="monospace" textAnchor="middle">{dissonance.toFixed(4)}</text>
              </svg>
            </div>
          </section>

          {/* Unity Score Gauge / Terminal */}
          <section className="bg-[#1e293b] rounded p-6 flex flex-col items-center">
            <h2 className="text-sm uppercase tracking-wider font-semibold mb-6 text-[#f8fafc] self-start w-full border-b border-[#334155] pb-2">Unity Score</h2>

            <div className={`mt-2 mb-8 px-12 py-8 bg-[#0a0f1e] rounded-md border text-center ${getUnityColor(unityScore)}`}>
              <div className="text-6xl font-mono tracking-tight font-bold">
                {unityScore.toFixed(3)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full text-center border-t border-b border-[#334155] py-4 mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94a3b8] font-monospace uppercase mb-1">Logic</span>
                <span className="text-sm font-mono text-[#f8fafc]">{logic.toFixed(3)}</span>
              </div>
              <div className="flex flex-col border-x border-[#334155]">
                <span className="text-[10px] text-[#94a3b8] font-monospace uppercase mb-1">Chaos</span>
                <span className="text-sm font-mono text-[#f8fafc]">{chaos.toFixed(3)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#94a3b8] font-monospace uppercase mb-1">Beauty</span>
                <span className="text-sm font-mono text-[#f8fafc]">{beauty.toFixed(3)}</span>
              </div>
            </div>
            
            <div className="text-[10px] font-mono text-[#94a3b8] tracking-widest mt-2">
              (L × C × B)^(1/φ) | φ = 1.618
            </div>
          </section>
        </div>

        {/* Proof of Refusal Feed order book */}
        <section className="bg-[#1e293b] rounded p-6">
          <h2 className="text-sm uppercase tracking-wider font-semibold mb-4 text-[#f8fafc] border-b border-[#334155] pb-2">Constitutional Decisions</h2>
          
          <div className="font-mono text-xs overflow-x-auto">
            <div className="flex text-[#94a3b8] pb-2 mb-2 border-b border-[#334155]">
              <div className="w-24">TIME</div>
              <div className="w-28">STATUS</div>
              <div className="w-24 text-right">SCORE</div>
              <div className="flex-1 pl-6">REASON / TX ID</div>
            </div>
            
            <div className="space-y-1">
              {[
                { id: '8F2B1A9C', time: '14:22:04', status: 'EXECUTE', score: 0.982, action: 'Yield alloc approved' },
                { id: '3D7E4C21', time: '14:18:33', status: 'REFUSED', score: 0.612, action: 'Comma threshold violation' },
                { id: '9A5F8B03', time: '14:15:10', status: 'EXECUTE', score: 0.974, action: 'Rebalance executed' },
                { id: '2C4E6A19', time: '14:10:02', status: 'REFUSED', score: 0.441, action: 'Unverified counterpart' }
              ].map((row, i) => (
                <div key={i} className="flex items-center py-2 text-[#f8fafc] hover:bg-[#334155]/30 cursor-default transition-colors">
                  <div className="w-24 text-[#94a3b8]">{row.time}</div>
                  <div className="w-28">
                    {row.status === 'EXECUTE' ? (
                      <span className="px-2 py-1 rounded bg-[#22c55e]/20 text-[#22c55e]">EXECUTE</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-[#ef4444]/20 text-[#ef4444]">REFUSED</span>
                    )}
                  </div>
                  <div className={`w-24 text-right ${row.status === 'EXECUTE' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                    {row.score.toFixed(3)}
                  </div>
                  <div className="flex-1 pl-6 truncate text-[#94a3b8]">
                    {row.action} [{row.id}]
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
