"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTerminal } from "./terminal-context";

const MARKET_PRICES = [
  { pair: "BTC/USD", price: "$82,441", up: true },
  { pair: "ETH/USD", price: "$3,187", up: true },
  { pair: "SOL/USD", price: "$138.52", up: false },
];

export function RepID() {
  const { displayMode } = useTerminal();
  const [earned, setEarned] = useState<number>(1247);
  const [perceived, setPerceived] = useState<number>(1189);
  
  useEffect(() => {
    async function fetchRepID() {
      const { data, error } = await supabase
        .from('repid_credentials')
        .select('*')
        .eq('agent_id', 'sophia')
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (!error && data && data.length > 0) {
        setEarned(data[0].repid_earned || 1247);
        setPerceived(data[0].repid_perceived || 1189);
      }
    }
    fetchRepID();
  }, []);

  const tradeLimit = Math.floor(100 * Math.exp(0.0008 * earned));

  return (
    <div
      className="flex flex-col p-4 flex-1"
      style={{ background: "#0d1424", border: "1px solid #1e293b" }}
    >
      {/* Label */}
      <div
        className="font-mono uppercase tracking-widest mb-3"
        style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em" }}
      >
        {displayMode === "simple" ? "Trust Score" : "Rep ID"}
      </div>

      {/* EARNED | PERCEIVED */}
      {displayMode === "simple" ? (
        <div className="flex flex-col p-4 mb-4 items-center justify-center" style={{ background: "#0a0f1e", border: "1px solid #1e293b" }}>
          <span className="font-mono text-3xl text-white font-medium">{earned}</span>
          <span className="font-mono text-xs text-green-500 mt-1">Excellent Standing</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex flex-col p-2" style={{ background: "#0a0f1e", border: "1px solid #1e293b" }}>
            <span className="font-mono uppercase" style={{ fontSize: 10, color: "#475569", letterSpacing: "0.12em" }}>EARNED</span>
            <span className="font-mono" style={{ fontSize: 24, color: "#f8fafc", fontWeight: 500, lineHeight: 1.2 }}>{earned}</span>
            <span className="font-mono" style={{ fontSize: 11, color: "#22c55e" }}>+50 today</span>
          </div>
          <div className="flex flex-col p-2" style={{ background: "#0a0f1e", border: "1px solid #1e293b" }}>
            <span className="font-mono uppercase" style={{ fontSize: 10, color: "#475569", letterSpacing: "0.12em" }}>PERCEIVED</span>
            <span className="font-mono" style={{ fontSize: 24, color: "#f8fafc", fontWeight: 500, lineHeight: 1.2 }}>{perceived}</span>
            <span className="font-mono" style={{ fontSize: 11, color: "#22c55e" }}>+23 today</span>
          </div>
        </div>
      )}

      {/* Trade limit bar */}
      <div
        className="flex items-center mb-4"
        style={{
          background: "#1c1407",
          border: "1px solid #78350f",
          padding: "6px 8px",
          borderRadius: 4,
        }}
      >
        <span className="font-mono" style={{ fontSize: 11, color: "#f59e0b" }}>
          Trade limit: ${tradeLimit.toLocaleString()}
        </span>
      </div>

      {/* Market prices */}
      <div
        className="font-mono uppercase mb-2"
        style={{ fontSize: 10, color: "#475569", letterSpacing: "0.12em" }}
      >
        Kraken Paper
      </div>
      <div className="flex flex-col">
        {MARKET_PRICES.map((p) => (
          <div
            key={p.pair}
            className="flex items-center justify-between"
            style={{
              borderBottom: "1px solid #0f172a",
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            <span className="font-mono" style={{ fontSize: 11, color: "#64748b" }}>
              {p.pair}
            </span>
            <span
              className="font-mono"
              style={{ fontSize: 11, color: p.up ? "#22c55e" : "#ef4444" }}
            >
              {p.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
