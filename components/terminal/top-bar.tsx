"use client";

import { useEffect, useState } from "react";
import { useTerminal } from "./terminal-context";

export function TopBar() {
  const [utcTime, setUtcTime] = useState("");
  const { displayMode, setDisplayMode } = useTerminal();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setUtcTime(`${h}:${m}:${s} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: 41,
        background: "#0d1424",
        borderBottom: "1px solid #1e293b",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <span className="text-white font-bold" style={{ fontSize: 16 }}>
          TrustTrader
        </span>
        <span
          className="font-mono uppercase tracking-widest hidden md:inline-block"
          style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.12em" }}
        >
          Constitutional AI Trading System
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {displayMode === "advanced" && (
          <>
            <span className="font-mono hidden md:inline-block" style={{ fontSize: 11, color: "#64748b" }}>
              Blockchain record
            </span>
            <span className="font-mono hidden md:inline-block" style={{ fontSize: 11, color: "#64748b" }}>
              On-chain verified
            </span>
          </>
        )}
        
        <div className="flex items-center bg-[#0a0f1e] rounded border border-[#1e293b] overflow-hidden ml-2">
          <button
            onClick={() => setDisplayMode("simple")}
            className="px-3 py-1 font-mono text-[10px] transition-colors"
            style={{ 
              background: displayMode === "simple" ? "#1e293b" : "transparent",
              color: displayMode === "simple" ? "#f8fafc" : "#64748b"
            }}
          >
            SIMPLE
          </button>
          <button
            onClick={() => setDisplayMode("advanced")}
            className="px-3 py-1 font-mono text-[10px] transition-colors"
            style={{ 
              background: displayMode === "advanced" ? "#1e293b" : "transparent",
              color: displayMode === "advanced" ? "#f8fafc" : "#64748b"
            }}
          >
            ADVANCED
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          <span
            className="rounded-full inline-block"
            style={{ width: 6, height: 6, background: "#22c55e" }}
            aria-hidden="true"
          />
          <span className="font-mono font-semibold" style={{ fontSize: 11, color: "#22c55e" }}>
            LIVE
          </span>
        </div>
        
        <span className="font-mono" style={{ fontSize: 11, color: "#64748b", minWidth: 80 }}>
          {utcTime}
        </span>
      </div>
    </header>
  );
}
