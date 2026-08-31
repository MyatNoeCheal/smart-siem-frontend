import { Radar, RotateCcw } from "lucide-react";
import clsx from "clsx";

export default function AttackSimulationControls({ isRunning, isDetected, onSimulate, onReset }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={onSimulate}
        disabled={isRunning}
        className={clsx(
          "flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-[12px] font-semibold uppercase tracking-wider transition-colors",
          isRunning
            ? "cursor-not-allowed bg-navy-700/60 text-navy-400"
            : "bg-risk-critical/15 text-risk-critical ring-1 ring-risk-critical/30 hover:bg-risk-critical/25"
        )}
      >
        <Radar className={clsx("h-4 w-4", isRunning && "animate-spin")} />
        {isRunning ? "Simulating…" : "Simulate Attack"}
      </button>

      <button
        onClick={onReset}
        disabled={!isRunning && !isDetected}
        className={clsx(
          "flex items-center gap-2 rounded-lg border px-3.5 py-2 font-mono text-[12px] text-navy-100 transition-colors",
          !isRunning && !isDetected
            ? "cursor-not-allowed border-white/[0.04] text-navy-400"
            : "border-white/[0.08] bg-navy-800/60 hover:border-command-cyan/30"
        )}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </button>
    </div>
  );
}