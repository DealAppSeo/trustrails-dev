"use client";

const UNITY = 0.9247;
const LOGIC = 0.961;
const CHAOS = 0.887;
const BEAUTY = 0.934;

function getScoreColor(score: number) {
  if (score > 0.95) return "#22c55e";
  if (score >= 0.7) return "#f59e0b";
  return "#ef4444";
}

function getScoreBorderColor(score: number) {
  if (score > 0.95) return "#14532d";
  if (score >= 0.7) return "#78350f";
  return "#7f1d1d";
}

function getScoreBgColor(score: number) {
  if (score > 0.95) return "#0a2218";
  if (score >= 0.7) return "#1c1407";
  return "#1a0808";
}

export function UnityScore() {
  const color = getScoreColor(UNITY);
  const borderColor = getScoreBorderColor(UNITY);
  const bgColor = getScoreBgColor(UNITY);
  const isCascade = UNITY > 0.7;

  return (
    <div
      className="flex flex-col p-4 flex-1"
      style={{
        background: "#0d1424",
        border: `1px solid ${borderColor}`,
      }}
    >
      {/* Label */}
      <div
        className="font-mono uppercase tracking-widest mb-2"
        style={{ fontSize: 10, color: "#475569", letterSpacing: "0.15em" }}
      >
        Unity Score
      </div>

      {/* Big number */}
      <div
        className="font-mono"
        style={{ fontSize: 52, fontWeight: 500, color, lineHeight: 1, marginBottom: 12 }}
        aria-label={`Unity score ${UNITY}`}
      >
        {UNITY.toFixed(4)}
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "LOGIC", value: LOGIC },
          { label: "CHAOS", value: CHAOS },
          { label: "BEAUTY", value: BEAUTY },
        ].map((m) => (
          <div key={m.label} className="flex flex-col">
            <span
              className="font-mono uppercase"
              style={{ fontSize: 10, color: "#475569", letterSpacing: "0.12em" }}
            >
              {m.label}
            </span>
            <span className="font-mono" style={{ fontSize: 16, color: "#94a3b8" }}>
              {m.value.toFixed(3)}
            </span>
          </div>
        ))}
      </div>

      {/* Formula */}
      <div
        className="font-mono mb-3"
        style={{ fontSize: 10, color: "#334155" }}
      >
        (L × C × B)^(1/φ) | φ = 1.618
      </div>

      {/* Status */}
      <div
        className="font-mono"
        style={{ fontSize: 10, color: isCascade ? "#22c55e" : "#ef4444" }}
        aria-live="polite"
      >
        {isCascade ? "▲ CASCADE — execute" : "▽ below threshold"}
      </div>
    </div>
  );
}
