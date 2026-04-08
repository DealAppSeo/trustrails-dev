import { SignalHarmonicMap } from "./signal-harmonic-map";
import { UnityScore } from "./unity-score";
import { RepID } from "./rep-id";
import { EquityCurve } from "./equity-curve";

export function CenterColumn() {
  return (
    <div
      className="flex flex-col flex-1 min-w-0 overflow-hidden"
      style={{ background: "#0a0f1e" }}
    >
      {/* Top half: Harmonic Map */}
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <div className="flex-1 min-h-0">
          <SignalHarmonicMap />
        </div>
        <div className="h-[180px] shrink-0">
          <EquityCurve />
        </div>
      </div>

      {/* Bottom half: Unity Score + RepID */}
      <div
        className="flex shrink-0"
        style={{ borderTop: "1px solid #1e293b", gap: 1, background: "#1e293b" }}
      >
        <UnityScore />
        <RepID />
      </div>
    </div>
  );
}
