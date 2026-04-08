"use client";

import { useTerminal } from "./terminal-context";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const DATA = [
  { day: "Day 1", safe: 10000, unvetoed: 10000, unity: 0.96 },
  { day: "Day 5", safe: 10050, unvetoed: 9800, unity: 0.91 },
  { day: "Day 10", safe: 10020, unvetoed: 9500, unity: 0.88 },
  { day: "Day 15", safe: 10100, unvetoed: 9200, unity: 0.76 },
  { day: "Day 20", safe: 10000, unvetoed: 8500, unity: 0.65 },
  { day: "Day 25", safe: 10080, unvetoed: 8800, unity: 0.82 },
  { day: "Day 30", safe: 10000, unvetoed: 9048.82, unity: 0.94 },
];

export function EquityCurve() {
  const { displayMode } = useTerminal();

  return (
    <div className="flex flex-col p-4 w-full" style={{ background: "#0a0f1e", borderTop: "1px solid #1e293b" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono uppercase text-[#475569] text-[10px] tracking-widest">
          {displayMode === "simple" ? "Performance Impact" : "Simulation: Constitutional Veto Delta"}
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span className="text-[#f8fafc] text-[10px] font-mono">With Veto (0% DD)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
            <span className="text-[#f8fafc] text-[10px] font-mono">Without Veto (49.6% DD)</span>
          </div>
        </div>
      </div>
      
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorUnvetoed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", fontSize: "11px", color: "#f8fafc" }}
              itemStyle={{ color: "#f8fafc" }}
            />
            <Area type="monotone" dataKey="safe" name="With Veto" stroke="#22c55e" fillOpacity={1} fill="url(#colorSafe)" />
            <Area type="monotone" dataKey="unvetoed" name="Without Veto" stroke="#ef4444" fillOpacity={1} fill="url(#colorUnvetoed)" />
            {displayMode === "advanced" && (
              <ReferenceLine y={9500} stroke="#f59e0b" strokeDasharray="3 3">
              </ReferenceLine>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 text-[10px] text-[#475569] font-mono flex justify-between">
        <span>$10,000 preserved</span>
        <span>$9,048.82 remaining</span>
      </div>
    </div>
  );
}
