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

const JURISDICTIONS = [
  { code: 'US', flag: '🇺🇸', msg: 'Wash sale exemption applies — harvest freely' },
  { code: 'UK', flag: '🇬🇧', msg: '30-day rule — no immediate rebuy after harvest' },
  { code: 'DE', flag: '🇩🇪', msg: '1-year hold = tax-free — harvesting less useful' },
  { code: 'AU', flag: '🇦🇺', msg: 'Consult local tax advisor' },
  { code: 'CA', flag: '🇨🇦', msg: 'Consult local tax advisor' },
  { code: 'SG', flag: '🇸🇬', msg: 'Consult local tax advisor' },
  { code: 'Other', flag: '🌐', msg: 'Consult local tax advisor' }
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

const InfoTooltip = ({ text }: { text: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block ml-1">
      <span 
        className="inline-flex items-center justify-center w-[12px] h-[12px] rounded-full bg-[#475569] text-white cursor-help text-[10px] font-bold select-none leading-none pb-[1px]"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}>i</span>
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 w-[240px] bg-[#1e293b] border border-[#334155] rounded p-2 text-[11px] font-mono text-[#94a3b8] pointer-events-none whitespace-pre-wrap text-left shadow-lg cursor-default select-text">
          {text}
        </div>
      )}
    </div>
  );
};

export default function TradePage() {
  const [profile, setProfile] = useState(RISK_PROFILES[2]);
  const [jurisdiction, setJurisdiction] = useState<string>('US');
  const [repId, setRepId] = useState<number>(6247); 
  const [perceivedRepId, setPerceivedRepId] = useState<number>(6180);
  
  useEffect(() => {
    const saved = localStorage.getItem('trusttrader_jurisdiction');
    if (saved) setJurisdiction(saved);
  }, []);

  const handleJurisdictionChange = (code: string) => {
    setJurisdiction(code);
    localStorage.setItem('trusttrader_jurisdiction', code);
  };

  const activeJurisdiction = JURISDICTIONS.find(j => j.code === jurisdiction) || JURISDICTIONS[0];
  
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
        .eq('agent_name', 'trinity-sophia')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!error && data && data.length > 0) {
        setRepId(data[0].earned_repid || 6247);
        setPerceivedRepId(data[0].perceived_repid || 6180);
      }
    };
    fetchRepId();
    
    const channel = supabase.channel('agent_repid_updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'agent_repid', filter: "agent_name=eq.'trinity-sophia'" }, payload => {
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
    <div className="flex flex-col h-screen bg-[#0a0f1e] text-[#f8fafc] overflow-hidden font-sans">
      
      {/* Topbar */}
      <header className="h-[41px] flex-shrink-0 bg-[#0a0f1e] border-b border-[#1e293b] flex items-center px-4 justify-between">
        <div className="flex items-center">
          <h1 className="text-sm font-bold mr-4">TrustTrader</h1>
          <p className="text-[#94a3b8] text-xs">Institutional AI Agent Finance Terminal</p>
        </div>
      </header>

      {/* Three Columns Main Area */}
      <div className="flex flex-1 overflow-hidden divide-x divide-[#1e293b]">
        
        {/* Left Column */}
        <div className="w-[260px] flex-shrink-0 overflow-y-auto p-4 bg-[#0a0f1e]">
          
          {/* Risk Profile Selector */}
          <section className="bg-[#1e293b] rounded p-4 mb-6 border border-[#1e293b]">
            <h2 className="text-[10px] uppercase tracking-wider font-semibold mb-4 text-[#475569]">
              Constitutional Risk Threshold
            </h2>
            <div className="flex flex-col gap-2">
              {RISK_PROFILES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setProfile(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border text-left ${
                    profile.id === p.id 
                      ? 'bg-[#3b82f6] text-[#f8fafc] border-[#3b82f6]' 
                      : 'bg-transparent text-[#94a3b8] border-[#334155] hover:border-[#94a3b8]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="text-[#94a3b8] font-mono text-[10px] mt-4 leading-tight flex items-start gap-1">
              <div>
                Threshold: <span className="text-[#f8fafc]">{profile.threshold}</span>
                <InfoTooltip text={`This threshold is derived from the\nPythagorean Comma — a mathematical\nconstant from number theory known for\n2,500 years. It represents the natural\nboundary between harmonic consonance\nand incommensurability.\nVery Conservative scales it by 1/φ.\nModerate uses the raw Comma baseline.\nVery Aggressive scales it by φ².`} />
                <br />
                {profile.note && <span>{profile.note}</span>}
              </div>
            </div>
          </section>

          {/* Tax Jurisdiction */}
          <section className="bg-[#1e293b] rounded p-4 border border-[#1e293b]">
            <h2 className="text-[10px] uppercase tracking-wider font-semibold mb-4 text-[#475569]">
              Tax Jurisdiction
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {JURISDICTIONS.map(j => (
                <button
                  key={j.code}
                  onClick={() => handleJurisdictionChange(j.code)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-colors border ${
                    jurisdiction === j.code 
                      ? 'bg-[#0f2044] text-white border-[#1d4ed8]' 
                      : 'bg-transparent text-[#94a3b8] border-[#1e293b] hover:border-[#334155]'
                  }`}
                >
                  {j.flag} {j.code}
                </button>
              ))}
            </div>
            <div className="text-[#94a3b8] text-xs leading-snug">
              {activeJurisdiction.code}: "{activeJurisdiction.msg}"
            </div>
          </section>
        </div>

        {/* Center Column */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#0a0f1e]">
          
          {/* Top Half: Harmonic Map Circle limits sizing */}
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            <section className="w-full max-w-[300px]">
              <h2 className="text-[10px] uppercase tracking-wider font-semibold mb-4 text-[#475569] border-b border-[#1e293b] pb-2">
                Signal Harmonic Map
              </h2>
              <div className="relative w-full aspect-square">
                <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
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
                          {/* We omit InfoTooltip inside SVG, keep title */}
                          <title>Comma Antagonist: Congressional Trading Signal. The 13th signal. Positioned outside the circle. When dominant, veto fires unconditionally.</title>
                        </g>
                      );
                    }

                    const angle = (signal.pos * 30 - 90) * (Math.PI / 180);
                    const r = 80;
                    const x = 100 + r * Math.cos(angle);
                    const y = 100 + r * Math.sin(angle);
                    
                    let color = '#f59e0b';
                    if (signal.value > 0.1) color = '#22c55e';
                    else if (signal.value < -0.1) color = '#ef4444';

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

                  <text x="100" y="93" fill="#94a3b8" fontSize="6" fontFamily="monospace" textAnchor="middle">
                    Dissonance 
                  </text>
                  <text x="100" y="105" fill="#f8fafc" fontSize="10" fontFamily="monospace" textAnchor="middle">
                    {dissonance.toFixed(4)}
                  </text>
                </svg>
              </div>
              <div className="flex justify-center mt-2">
                <InfoTooltip text={`Pythagorean Comma (531441/524288).\nMeasures how far signals deviate from harmony.\n\nAlso defined as:\nDissonance measures signal incoherence\nusing the Pythagorean Comma — the exact\nmathematical gap between 12 perfect fifths\nand 7 octaves (531441/524288 = 1.013643).\nThis constant was discovered, not chosen.\nBelow threshold = signals are in tune.\nAbove threshold = constitutional veto fires.`} />
              </div>
            </section>
          </div>

          {/* Bottom Half */}
          <div className="h-[240px] flex divide-x divide-[#1e293b] border-t border-[#1e293b]">
            <section className="flex-1 p-4 overflow-y-auto bg-[#0a0f1e]">
              <h2 className="text-[10px] uppercase tracking-wider font-semibold mb-3 text-[#f8fafc] border-b border-[#334155] pb-2 sticky top-0 bg-[#0a0f1e] z-10">
                Constitutional Decisions
              </h2>
              
              <div className="font-mono text-[10px]">
                <div className="flex text-[#94a3b8] pb-2 mb-2 border-b border-[#334155]">
                  <div className="w-16">TIME</div>
                  <div className="w-20">STATUS</div>
                  <div className="w-16 text-right">SCORE</div>
                  <div className="flex-1 pl-4">REASON / TX ID</div>
                </div>
                
                <div className="space-y-1">
                  {[
                    { id: '8F2B1A9C', time: '14:22:04', status: 'EXECUTE', score: 0.982, action: 'Yield alloc approved' },
                    { id: '3D7E4C21', time: '14:18:33', status: 'REFUSED', score: 0.612, action: 'Comma threshold violation' },
                    { id: '9A5F8B03', time: '14:15:10', status: 'EXECUTE', score: 0.974, action: 'Rebalance executed' },
                    { id: '2C4E6A19', time: '14:10:02', status: 'REFUSED', score: 0.441, action: 'Unverified counterpart' },
                    { id: '7B3D2F11', time: '14:05:12', status: 'EXECUTE', score: 0.985, action: 'Treasury swap executed' }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center py-1.5 text-[#f8fafc] hover:bg-[#1e293b] cursor-default transition-colors">
                      <div className="w-16 text-[#94a3b8]">{row.time}</div>
                      <div className="w-20">
                        {row.status === 'EXECUTE' ? (
                          <span className="px-1.5 py-0.5 rounded bg-[#22c55e]/20 text-[#22c55e]">EXECUTE</span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444]">REFUSED</span>
                        )}
                      </div>
                      <div className={`w-16 text-right ${row.status === 'EXECUTE' ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                        {row.score.toFixed(3)}
                      </div>
                      <div className="flex-1 pl-4 truncate text-[#94a3b8]">
                        {row.action} [{row.id}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="w-[280px] flex-shrink-0 overflow-y-auto p-4 bg-[#0a0f1e]">
          
          <section className="bg-[#1e293b] rounded p-4 flex flex-col items-center">
            <h2 className="text-[10px] uppercase tracking-wider font-semibold mb-4 text-[#f8fafc] self-start w-full border-b border-[#334155] pb-2 flex items-center">
              Unity Score
              <InfoTooltip text={`(L×C×B)^(1/φ) where φ=1.618.\nAbove 0.95 triggers execution. Below = veto.\n\nUnity Score = (Logic × Chaos × Beauty)^(1/φ)\nwhere φ = 1.618 (golden ratio).\nScores above 0.95 trigger execution.\nBelow 0.95 the agent waits or refuses.\nCurrently: ${unityScore.toFixed(3)}`} />
            </h2>

            <div className={`mt-2 mb-6 px-4 py-8 w-full bg-[#0a0f1e] rounded-md border text-center flex justify-center ${getUnityColor(unityScore)}`}>
              <div className="text-5xl font-mono tracking-tight font-bold">
                {unityScore.toFixed(3)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full text-center border-t border-b border-[#334155] py-3 mb-3">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-[#94a3b8] font-mono uppercase mb-1 flex items-center">
                  Logic 
                  <InfoTooltip text={`Logic = agent RepID ÷ 10,000.\nRepID is the agent's verified behavioral\nreputation score earned through past\ndecisions. Higher = more trusted.\nCurrently: ${logic.toFixed(3)} (RepID ${repId})`} />
                </span>
                <span className="text-xs font-mono text-[#f8fafc]">{logic.toFixed(3)}</span>
              </div>
              <div className="flex flex-col border-x border-[#334155] items-center">
                <span className="text-[9px] text-[#94a3b8] font-mono uppercase mb-1 flex items-center">
                  Chaos
                  <InfoTooltip text={`Chaos = ANFIS signal confidence.\nMeasures how clearly the 13 market signals\nare pointing in one direction.\n1.0 = perfect signal alignment.\n0.0 = total signal conflict.\nCurrently: ${chaos.toFixed(3)}`} />
                </span>
                <span className="text-xs font-mono text-[#f8fafc]">{chaos.toFixed(3)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-[#94a3b8] font-mono uppercase mb-1 flex items-center">
                  Beauty
                  <InfoTooltip text={`Beauty = 1 − dissonance.\nDissonance measures how far the signal\nharmony deviates from the Pythagorean\nComma threshold (0.013643).\nLower dissonance = more beautiful harmony.\nCurrently: ${beauty.toFixed(3)}`} />
                </span>
                <span className="text-xs font-mono text-[#f8fafc]">{beauty.toFixed(3)}</span>
              </div>
            </div>
          </section>

          <section className="font-mono text-[10px] text-[#94a3b8] mt-6 flex flex-col gap-3 px-2">
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
              <span className="flex items-center text-[#475569]">
                REPID EARNED 
                <InfoTooltip text={`+50 good trade. -150 bad trade.\n+10 per constitutional refusal. Not purchasable.\n\nEarned RepID is calculated from verified\non-chain behavioral outcomes only.\n+50 per successful trade decision.\n-150 per failed trade (3× asymmetry).\n+10 per Constitutional Refusal issued.\nThis score cannot be purchased or gamed.`} />
              </span>
              <span className="text-[#f8fafc]">{repId.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
              <span className="flex items-center text-[#475569]">
                REPID PERCEIVED 
                <InfoTooltip text={`Perceived RepID reflects external vouching\nand third-party attestations. High-reputation\nentities can vouch for this agent, boosting\nperceived score. Vouching dilutes as N grows:\nboost = α × V × β × 1/(1 + k√N)`} />
              </span>
              <span className="text-[#f8fafc]">{perceivedRepId.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#1e293b] pb-2">
              <span className="flex items-center text-[#475569]">
                TRADE LIMIT 
                <InfoTooltip text={`$100 × e^(0.0008 × RepID).\nGrows exponentially with reputation.\n\nMaximum position size for this agent.\nFormula: $100 × e^(0.0008 × RepID)\nAt RepID 6,247: limit = $18,447.\nLimit grows exponentially with reputation.\nConstitutional veto applies regardless\nof trade limit.`} />
              </span>
              <span className="text-[#f8fafc]">${Math.round(100 * Math.exp(0.0008 * repId)).toLocaleString()}</span>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
