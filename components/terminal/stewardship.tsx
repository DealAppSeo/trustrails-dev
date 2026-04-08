"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTerminal } from "./terminal-context";

type Tier = {
  tier_level: number;
  tier_name: string;
  ui_label: string;
  ui_color: string;
  min_repid_to_act: number;
  min_days_active: number;
  requires_sbt: boolean;
  repid_at_risk_pct: number;
  yield_rate: number;
  plain_english_description: string;
};

export function Stewardship() {
  const { displayMode } = useTerminal();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTiers() {
      const { data, error } = await supabase
        .from('accountability_tiers')
        .select('*')
        .order('tier_level');
      if (!error && data) {
        setTiers(data as Tier[]);
      }
      setLoading(false);
    }
    fetchTiers();
  }, []);

  return (
    <section aria-labelledby="stewardship-label" className="mt-4 border-t border-[#1e293b] pt-3">
      <div 
        id="stewardship-label"
        className="font-mono uppercase text-[#475569] tracking-widest text-[10px] mb-2 pb-2 border-b border-[#1e293b]"
      >
        {displayMode === "simple" ? "Trust Tiers" : "Stewardship"}
      </div>

      <div className="bg-[#0f172a] p-3 rounded border border-[#1e293b] mb-3">
        <div className="text-[11px] text-[#94a3b8] mb-1">Your Current Tier</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
          <span className="text-[#f8fafc] font-semibold text-[13px]">Peer Backing</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#64748b] font-mono">
          <div>Agents Backed: 0</div>
          <div>Yield: $0.00</div>
          <div className="col-span-2">RepID Staked: 0 pts</div>
        </div>
      </div>

      {displayMode === "advanced" && (
        <div className="flex flex-col gap-2 relative">
          {/* Pro lock overlay (but instructions say Pro locks are inside Advanced, these might just be the lock badging, let's just make the lock a badge) */}
          <div className="absolute -top-10 right-0 text-[8px] bg-[#334155] text-white px-1 rounded inline-block shadow-lg">
            [🔒 Pro] Portfolio
          </div>
          
          {loading ? (
            <div className="text-[#475569] text-xs font-mono">Loading tiers...</div>
          ) : (
            tiers.map((t) => (
              <div key={t.tier_level} className="bg-[#0a0f1e] border border-[#1e293b] p-2 rounded relative">
                {t.requires_sbt && (
                  <div className="absolute right-2 top-2 text-[8px] bg-[#1c1407] border border-[#78350f] text-[#f59e0b] px-1 rounded">
                    [🔒 SBT]
                  </div>
                )}
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.ui_color || '#3b82f6' }}></span>
                  <span className="text-[11px] font-bold text-[#e2e8f0]">{t.tier_name}</span>
                </div>
                <div className="text-[9px] text-[#475569] font-mono leading-tight mb-1">
                  Requires RepID ≥ {t.min_repid_to_act}
                </div>
                <div className="grid grid-cols-2 gap-1 mb-1">
                  <div className="bg-[#0f172a] p-1 rounded text-[9px] text-[#94a3b8]">
                    <span className="text-[#ef4444] font-mono mr-1">Risk</span>
                    {t.repid_at_risk_pct * 100}%
                  </div>
                  <div className="bg-[#0f172a] p-1 rounded text-[9px] text-[#94a3b8]">
                    <span className="text-[#22c55e] font-mono mr-1">Yield</span>
                    {t.yield_rate * 100}%
                  </div>
                </div>
                <div className="text-[9px] text-[#64748b] truncate" title={t.plain_english_description}>
                  {t.plain_english_description}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-2">
        <button className="w-full bg-[#1e293b] hover:bg-[#334155] text-[#94a3b8] text-[11px] py-1.5 rounded border border-[#334155] transition-colors">
          Start Backing →
        </button>
      </div>
    </section>
  );
}
