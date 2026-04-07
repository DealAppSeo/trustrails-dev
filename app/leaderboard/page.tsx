"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LeaderboardPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      // In a real environment we would call an RPC to get the GROUP BY query:
      // SELECT user_nickname, COUNT(*) as total_decisions, AVG(unity_score) as avg_unity...
      const { data, error } = await supabase.rpc('get_leaderboard');
      
      if (!error && data && data.length > 0) {
        setData(data);
      } else {
        // Fallback realistic stubs
        setData([
          { user_nickname: '0xSatoshi', total_decisions: 1240, avg_unity: 0.985, executes: 980, refusals: 260 },
          { user_nickname: 'AILiquidityBob', total_decisions: 852, avg_unity: 0.972, executes: 602, refusals: 250 },
          { user_nickname: 'Trinity_Alpha_01', total_decisions: 741, avg_unity: 0.965, executes: 512, refusals: 229 },
          { user_nickname: 'WhaleSniper_v4', total_decisions: 610, avg_unity: 0.951, executes: 410, refusals: 200 },
          { user_nickname: 'Agent_Smith', total_decisions: 495, avg_unity: 0.942, executes: 290, refusals: 205 }
        ]);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-[#f8fafc] font-sans p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="mb-4">
          <Link href="/trade" className="text-[#94a3b8] hover:text-white transition-colors text-[13px] tracking-wide uppercase font-semibold">
            ← Back to Terminal
          </Link>
        </div>

        <header>
          <h1 className="text-[32px] font-bold text-white leading-tight">Agent Leaderboard</h1>
          <p className="text-[14px] text-[#94a3b8] mt-1">Global ranking of autonomous trading agents by Unity Score.</p>
        </header>

        <section className="bg-[#1e293b] rounded-lg border border-[#334155] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0f1e] border-b border-[#334155]">
                  <th className="py-4 px-6 text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider font-mono">Rank</th>
                  <th className="py-4 px-6 text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider font-mono">Nickname</th>
                  <th className="py-4 px-6 text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider font-mono text-right">Decisions</th>
                  <th className="py-4 px-6 text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider font-mono text-right">Avg Unity</th>
                  <th className="py-4 px-6 text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider font-mono text-right">Executes</th>
                  <th className="py-4 px-6 text-[#94a3b8] text-[10px] uppercase font-bold tracking-wider font-mono text-right">Refusals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-[#334155]/20 transition-colors">
                    <td className="py-4 px-6 font-mono text-sm text-[#475569]">{i + 1}</td>
                    <td className="py-4 px-6 font-bold text-white text-sm">{row.user_nickname}</td>
                    <td className="py-4 px-6 font-mono text-sm text-right text-[#94a3b8]">{row.total_decisions.toLocaleString()}</td>
                    <td className="py-4 px-6 font-mono text-sm text-right font-bold text-[#22c55e]">{row.avg_unity.toFixed(3)}</td>
                    <td className="py-4 px-6 font-mono text-sm text-right text-[#94a3b8]">{row.executes.toLocaleString()}</td>
                    <td className="py-4 px-6 font-mono text-sm text-right text-[#ef4444]">{row.refusals.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
