"use client";

import { useState } from "react";
import Link from "next/link";
import { useTerminal } from "./terminal-context";

const RISK_PROFILES = [
  { name: "Very Conservative", threshold: "0.01205" },
  { name: "Conservative", threshold: "0.01560" },
  { name: "Moderate", threshold: "0.01950", note: "Pythagorean Comma baseline" },
  { name: "Aggressive", threshold: "0.03155" },
  { name: "Very Aggressive", threshold: "0.05108" },
];

type SignalValue = {
  name: string;
  value: string;
  numeric: number;
  warn?: boolean;
};

const SIGNALS: SignalValue[] = [
  { name: "Fear & Greed", value: "+0.72", numeric: 0.72 },
  { name: "Whale Alert", value: "+0.55", numeric: 0.55 },
  { name: "On-chain Health", value: "+0.61", numeric: 0.61 },
  { name: "BTC Price", value: "+0.48", numeric: 0.48 },
  { name: "RSI", value: "-0.12", numeric: -0.12 },
  { name: "Volume Spike", value: "+0.38", numeric: 0.38 },
  { name: "Exchange Sentiment", value: "+0.29", numeric: 0.29 },
  { name: "News Sentiment", value: "-0.07", numeric: -0.07 },
  { name: "Interest Rates", value: "-0.31", numeric: -0.31 },
  { name: "Inflation", value: "-0.18", numeric: -0.18 },
  { name: "Guru Consensus", value: "+0.44", numeric: 0.44 },
  { name: "ETF Flow", value: "+0.63", numeric: 0.63 },
  { name: "Congressional", value: "-0.91", numeric: -0.91, warn: true },
];

function signalColor(numeric: number, warn?: boolean): string {
  if (warn || numeric < -0.1) return "#ef4444";
  if (numeric >= -0.1 && numeric < 0.2) return "#f59e0b";
  return "#22c55e";
}

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 10,
  fontFamily: "monospace",
  textTransform: "uppercase",
  color: "#475569",
  letterSpacing: "0.15em",
  paddingBottom: 8,
  borderBottom: "1px solid #1e293b",
  marginBottom: 10,
};

export function LeftColumn() {
  const [activeProfile, setActiveProfile] = useState(2); // Moderate
  const { displayMode } = useTerminal();

  return (
    <div
      className="flex flex-col gap-5 overflow-y-auto"
      style={{ width: 260, background: "#0a0f1e", padding: 16, flexShrink: 0 }}
    >
      {/* Section 1 - Risk Profile */}
      <section aria-labelledby="risk-label">
        <div style={SECTION_LABEL} id="risk-label">
          {displayMode === "simple" ? "Agent Rules" : "Constitutional Risk Profile"}
        </div>
        <div className="flex flex-col gap-1.5">
          {RISK_PROFILES.map((p, i) => {
            const isActive = i === activeProfile;
            return (
              <button
                key={p.name}
                onClick={() => setActiveProfile(i)}
                className="w-full text-left flex flex-col justify-center px-3 relative"
                style={{
                  height: 52,
                  borderRadius: 4,
                  border: `1px solid ${isActive ? "#1d4ed8" : "#1e293b"}`,
                  background: isActive ? "#0f2044" : "transparent",
                  color: isActive ? "#93c5fd" : "#94a3b8",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                aria-pressed={isActive}
              >
                <span className="font-sans" style={{ fontSize: 12, fontWeight: 500 }}>
                  {p.name}
                </span>
                
                {displayMode === "advanced" && (
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: isActive ? "#60a5fa" : "#475569",
                      marginTop: 2,
                    }}
                  >
                    {p.threshold}
                    {p.note && (
                      <span style={{ color: "#334155", marginLeft: 4 }}>
                        — {p.note}
                      </span>
                    )}
                  </span>
                )}
                
                {displayMode === "advanced" && p.name !== "Moderate" && isActive && (
                  <div className="absolute right-2 top-2 px-1 text-[8px] bg-[#334155] text-white rounded">
                    [🔒 Pro]
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-3 text-center">
          <Link href="/signals" className="inline-block text-[11px] font-mono text-[#3b82f6] hover:text-[#60a5fa]">
            Customize Signals →
          </Link>
        </div>
      </section>

      {/* Section 2 - Signal Inputs */}
      <section aria-labelledby="signal-label" className="flex-1">
        <div style={SECTION_LABEL} id="signal-label">
          {displayMode === "simple" ? "Market Inputs" : "Signal Inputs"}
          {displayMode === "advanced" && (
            <span className="float-right text-[8px] bg-[#334155] text-white px-1 rounded inline-block mt-0.5">
              [🔒 Pro] Weighting
            </span>
          )}
        </div>
        <div className="flex flex-col">
          {SIGNALS.map((s) => {
            const color = signalColor(s.numeric, s.warn);
            return (
              <div
                key={s.name}
                className="flex items-center"
                style={{
                  borderBottom: "1px solid #0f172a",
                  paddingTop: 6,
                  paddingBottom: 6,
                  gap: 8,
                }}
              >
                <span
                  className="rounded-full shrink-0"
                  style={{ width: 7, height: 7, background: color }}
                  aria-hidden="true"
                />
                <span
                  className="font-sans flex-1 truncate"
                  style={{ fontSize: 11, color: "#94a3b8" }}
                >
                  {s.warn && (
                    <span style={{ color: "#ef4444", marginRight: 3 }} aria-label="Warning">
                      ⚠
                    </span>
                  )}
                  {s.name}
                </span>
                
                {displayMode === "advanced" && (
                  <span
                    className="font-mono"
                    style={{ fontSize: 11, color, minWidth: 44, textAlign: "right" }}
                  >
                    {s.value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
