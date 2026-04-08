"use client";

const SIGNALS_MAP = [
  { name: "F&G", value: 0.72 },
  { name: "Whale", value: 0.55 },
  { name: "Chain", value: 0.61 },
  { name: "BTC", value: 0.48 },
  { name: "RSI", value: -0.12 },
  { name: "Vol", value: 0.38 },
  { name: "Exch", value: 0.29 },
  { name: "News", value: -0.07 },
  { name: "Rates", value: -0.31 },
  { name: "CPI", value: -0.18 },
  { name: "Guru", value: 0.44 },
  { name: "ETF", value: 0.63 },
];

const CONGRESSIONAL = { name: "Congressional", value: -0.91 };

function signalDotColor(v: number) {
  if (v < -0.1) return "#ef4444";
  if (v < 0.2) return "#f59e0b";
  return "#22c55e";
}

// Note names for ring positions (music-themed)
const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const CX = 160;
const CY = 160;
const R_OUTER = 120;
const R_INNER = 90;
const R_DOT = 6;
const R_LABEL = 145;

export function SignalHarmonicMap() {
  return (
    <div
      className="flex flex-col"
      style={{ borderBottom: "1px solid #1e293b" }}
    >
      {/* Section label */}
      <div
        className="px-4 pt-4"
        style={{
          fontSize: 10,
          fontFamily: "monospace",
          textTransform: "uppercase",
          color: "#475569",
          letterSpacing: "0.15em",
          paddingBottom: 10,
          borderBottom: "1px solid #1e293b",
        }}
      >
        Signal Harmonic Map
      </div>

      {/* SVG */}
      <div className="flex justify-center py-4">
        <svg
          width={320}
          height={320}
          viewBox="0 0 320 320"
          aria-label="Signal harmonic map showing 12 signals on a circular ring"
          role="img"
        >
          {/* Outer ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R_OUTER}
            fill="none"
            stroke="#1e293b"
            strokeWidth={1}
          />
          {/* Inner dashed ring */}
          <circle
            cx={CX}
            cy={CY}
            r={R_INNER}
            fill="none"
            stroke="#0f172a"
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* Center labels */}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            fontSize={11}
            fill="#475569"
            fontFamily="monospace"
          >
            dissonance
          </text>
          <text
            x={CX}
            y={CY + 10}
            textAnchor="middle"
            fontSize={14}
            fill="#94a3b8"
            fontFamily="monospace"
          >
            0.0124
          </text>

          {/* 12 signal dots */}
          {SIGNALS_MAP.map((sig, i) => {
            const angle = (i * 2 * Math.PI) / 12 - Math.PI / 2;
            const dotX = CX + R_OUTER * Math.cos(angle);
            const dotY = CY + R_OUTER * Math.sin(angle);
            const labelX = CX + R_LABEL * Math.cos(angle);
            const labelY = CY + R_LABEL * Math.sin(angle);
            const radius = 3 + Math.abs(sig.value) * 5; // 3–8px
            const color = signalDotColor(sig.value);

            // Determine text-anchor based on position
            let anchor: "start" | "middle" | "end" = "middle";
            const cosA = Math.cos(angle);
            if (cosA > 0.2) anchor = "start";
            else if (cosA < -0.2) anchor = "end";

            return (
              <g key={sig.name}>
                <circle cx={dotX} cy={dotY} r={Math.min(radius, R_DOT)} fill={color} opacity={0.9} />
                <text
                  x={labelX}
                  y={labelY + 4}
                  textAnchor={anchor}
                  fontSize={9}
                  fill="#475569"
                  fontFamily="monospace"
                >
                  {NOTE_NAMES[i]}
                </text>
              </g>
            );
          })}

          {/* Congressional dot — slightly outside ring, top area */}
          {(() => {
            const angle = -Math.PI / 2 + 0.35; // slightly off top
            const dotR = R_OUTER + 18;
            const dotX = CX + dotR * Math.cos(angle);
            const dotY = CY + dotR * Math.sin(angle);
            return (
              <g>
                <circle cx={dotX} cy={dotY} r={5} fill="#ef4444" opacity={0.95} />
                <text
                  x={dotX + 8}
                  y={dotY - 6}
                  textAnchor="start"
                  fontSize={9}
                  fill="#ef4444"
                  fontFamily="monospace"
                >
                  comma antagonist
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
