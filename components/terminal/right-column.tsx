"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useTerminal } from "./terminal-context";
import { Stewardship } from "./stewardship";

type Decision = {
  id: string;
  created_at: string;
  decision: "EXECUTE" | "REFUSED";
  unity_score: number;
  reason: string;
  tx_hash: string;
};

function Badge({ type, displayMode }: { type: "EXECUTE" | "REFUSED", displayMode: string }) {
  const isExec = type === "EXECUTE";
  const label = displayMode === "simple" 
    ? (isExec ? "Trade Approved" : "Trade Declined") 
    : type;
    
  return (
    <span
      className="font-mono shrink-0"
      style={{
        fontSize: 9,
        fontWeight: 600,
        padding: "2px 4px",
        borderRadius: 99,
        border: `1px solid ${isExec ? "#14532d" : "#7f1d1d"}`,
        background: isExec ? "#052e16" : "#450a0a",
        color: isExec ? "#4ade80" : "#f87171",
        letterSpacing: "0.05em",
        whiteSpace: "nowrap"
      }}
    >
      {label}
    </span>
  );
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

export function RightColumn() {
  const { displayMode } = useTerminal();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchDecisions() {
      const { data, error } = await supabase
        .from('trade_execution_log')
        .select('id, created_at, decision, unity_score, reason, tx_hash')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (!error && data) {
        setDecisions(data as Decision[]);
      }
    }
    
    fetchDecisions();
    
    // Set up realtime sub
    const sub = supabase.channel('trade_execution_log_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trade_execution_log' }, (payload) => {
        setDecisions((prev) => [payload.new as Decision, ...prev.slice(0, 49)]);
      }).subscribe();
      
    return () => { supabase.removeChannel(sub); };
  }, []);

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{ width: 300, background: "#0a0f1e", padding: 16, flexShrink: 0 }}
    >
      {/* Decisions */}
      <section aria-labelledby="decisions-label" className="flex flex-col flex-1 min-h-[300px]">
        <div style={SECTION_LABEL} id="decisions-label">
          {displayMode === "simple" ? "Trading Log" : "Constitutional Decisions"}
        </div>
        
        <div
          ref={listRef}
          className="flex flex-col gap-0.5 overflow-y-auto flex-1 h-[300px]"
          style={{ scrollbarWidth: "none" }}
          aria-live="polite"
          aria-atomic="false"
        >
          {decisions.length === 0 ? (
            <div className="text-[#475569] text-xs font-mono p-2">Waiting for first execution...</div>
          ) : decisions.map((d) => {
            const time = new Date(d.created_at).toLocaleTimeString([], { hour12: false });
            return (
              <div
                key={d.id}
                className="flex flex-col gap-1"
                style={{ paddingTop: 6, paddingBottom: 6, borderBottom: "1px solid #0f172a" }}
              >
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono shrink-0" style={{ fontSize: 10, color: "#475569" }}>
                      {time}
                    </span>
                    <Badge type={d.decision} displayMode={displayMode} />
                  </div>
                  <span className="font-mono shrink-0" style={{ fontSize: 10, color: "#94a3b8" }}>
                    {d.unity_score ? parseFloat(String(d.unity_score)).toFixed(4) : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="font-sans truncate flex-1"
                    style={{ fontSize: 10, color: "#475569" }}
                    title={d.reason}
                  >
                    {d.reason}
                  </span>
                  <Link 
                    href="/agents/sophia/.well-known/agent-card.json"
                    target="_blank"
                    className="shrink-0 text-[9px] text-[#3b82f6] hover:underline"
                  >
                    View Agent Card →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* On-chain proof */}
      <section aria-labelledby="proof-label" style={{ borderTop: "1px solid #1e293b", paddingTop: 12, marginTop: 12 }}>
        <div style={{ ...SECTION_LABEL, marginBottom: 8 }} id="proof-label">
          {displayMode === "simple" ? "Trust Credential" : "On-Chain Proof"}
        </div>
        <div
          className="flex flex-col gap-1 font-mono"
          style={{ fontSize: 10, color: "#334155" }}
        >
          <div>
            <span style={{ color: "#475569" }}>{displayMode === "simple" ? "Verified:" : "ERC-8004:"} </span>
            0x3fA4...c81B
          </div>
          <div>
            <span style={{ color: "#475569" }}>{displayMode === "simple" ? "Hash:" : "Merkle root:"} </span>
            0xab12...f790
          </div>
          {decisions.length > 0 && decisions[0].tx_hash && displayMode === "advanced" && (
            <div>
              <span style={{ color: "#475569" }}>Tx Hash: </span>
              {decisions[0].tx_hash.substring(0,10)}...
            </div>
          )}
        </div>
        {displayMode === "advanced" && (
          <a
            href="https://sepolia.basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono inline-block mt-2"
            style={{ fontSize: 10, color: "#3b82f6" }}
          >
            View on Basescan ↗
          </a>
        )}
      </section>

      {/* Stewardship Component */}
      <Stewardship />
    </div>
  );
}
