"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignalsPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('signal_library')
        .select('*')
        .order('is_core', { ascending: false })
        .order('category')
        .order('display_name');
      
      if (data) setSignals(data);
    }
    load();
  }, []);

  const categories = ['All', 'Sentiment', 'On-Chain', 'Macro', 'Technical'];
  const filtered = filter === 'All' ? signals : signals.filter(s => s.category === filter);

  const catColor = (cat: string) => {
    switch (cat) {
      case 'Sentiment': return 'bg-[#3b82f6]/20 text-[#3b82f6]';
      case 'On-Chain': return 'bg-[#22c55e]/20 text-[#22c55e]';
      case 'Macro': return 'bg-[#f59e0b]/20 text-[#f59e0b]';
      case 'Technical': return 'bg-[#8b5cf6]/20 text-[#8b5cf6]';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#f8fafc] font-sans p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="mb-4">
          <Link href="/trade" className="text-[#94a3b8] hover:text-white transition-colors text-[13px] tracking-wide uppercase font-semibold">
            ← Back to Terminal
          </Link>
        </div>

        <header>
          <h1 className="text-[32px] font-bold text-white leading-tight">Signal Library</h1>
          <p className="text-[14px] text-[#94a3b8] mt-1">{signals.length || 37} signals available. Select yours.</p>
        </header>

        {/* Tier banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1e293b] rounded-lg p-4 flex flex-col justify-center">
            <div className="font-bold text-white text-sm">Free</div>
            <div className="text-sm text-[#94a3b8]">View only</div>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-4 flex flex-col justify-center">
            <div className="font-bold text-white text-sm">Pro <span className="text-[#22c55e] ml-1">$399</span></div>
            <div className="text-sm text-[#94a3b8]">Adjust weights</div>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-4 flex flex-col justify-center">
            <div className="font-bold text-white text-sm">Custom <span className="text-[#22c55e] ml-1">$749</span></div>
            <div className="text-sm text-[#94a3b8]">Add 5 custom signals</div>
          </div>
          <div className="bg-[#1e293b] rounded-lg p-4 flex flex-col justify-center">
            <div className="font-bold text-white text-sm">Any tier <span className="text-[#3b82f6] ml-1">-$250</span></div>
            <div className="text-sm text-[#94a3b8]">Enable federated learning</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 border-b border-[#1e293b] pb-4">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === c ? 'bg-[#1e293b] text-white border border-[#334155]' : 'text-[#94a3b8] hover:text-white border border-transparent hover:border-[#334155]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-[#0d1424] border border-[#1e293b] rounded-[4px] p-4 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-white text-sm">{s.display_name}</h3>
                {s.is_core && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-black tracking-wider border border-amber-500/20">
                    CORE
                  </span>
                )}
              </div>
              <div className="mb-3">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${catColor(s.category)}`}>
                  {s.category}
                </span>
              </div>
              <p className="text-[#94a3b8] text-[12px] flex-1 mb-6 leading-relaxed">
                {s.description}
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-[#1e293b] mt-auto">
                <span className="text-[#475569] text-[10px] uppercase font-semibold">{s.data_source}</span>
                <span className="font-mono text-[#475569] text-[12px]">
                  w=<span className="text-[#f8fafc]">{Number(s.default_weight).toFixed(2)}</span>
                </span>
              </div>
            </div>
          ))}
          {/* Fallback stubs if no real data retrieved */}
          {signals.length === 0 && Array.from({length: 6}).map((_, i) => (
             <div key={i} className="bg-[#0d1424] border border-[#1e293b] rounded-[4px] p-4 flex flex-col h-full opacity-50 animate-pulse">
               <div className="flex justify-between items-center mb-4">
                 <div className="w-32 h-4 bg-[#1e293b] rounded"></div>
                 <div className="w-10 h-4 bg-[#1e293b] rounded"></div>
               </div>
               <div className="w-16 h-4 bg-[#1e293b] rounded mb-5"></div>
               <div className="w-full h-16 bg-[#1e293b] rounded mb-6"></div>
               <div className="flex justify-between mt-auto pt-3 border-t border-[#1e293b]">
                 <div className="w-20 h-3 bg-[#1e293b] rounded"></div>
                 <div className="w-10 h-3 bg-[#1e293b] rounded"></div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
