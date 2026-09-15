import { useEffect, useState } from "react";
import { BrainCircuit } from "lucide-react";
import GlassPanel from "../ui/GlassPanel";
import { getAiConfidence } from "../../services/analyticsService";

function Bar({ label, value, sub }) {
  const pct = value == null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[12px] text-navy-100/90">{label}</span>
        <span className="font-mono text-[12px] font-semibold text-command-cyan">{value != null ? `${value}%` : "—"}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-navy-950/60">
        <div className="h-full rounded-full bg-gradient-to-r from-command-blue to-command-cyan transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      {sub && <p className="mt-0.5 text-[10px] text-navy-500">{sub}</p>}
    </div>
  );
}

export default function AIConfidenceBars() {
  const [state, setState] = useState({ data: null, source: "mock", loading: true });

  useEffect(() => {
    let mounted = true;
    getAiConfidence().then((res) => mounted && setState({ ...res, loading: false }));
    return () => { mounted = false; };
  }, []);

  const d = state.data;

  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-4 w-4 text-command-violet" />
          <h2 className="font-display text-[14px] font-semibold text-navy-50">AI Detection Confidence</h2>
        </div>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">
          {state.loading ? "scoring…" : state.source === "live" ? "live" : "mock"}
        </span>
      </div>
      {state.loading ? (
        <p className="py-6 text-center text-[12px] text-navy-400">Scoring recent events…</p>
      ) : (
        <div className="space-y-4">
          <Bar label="Fraud AI" value={d.fraud} sub={`avg risk · last ${d.sampleSizes.fraud} flagged`} />
          <Bar label="Behavioral AI" value={d.behavioral} sub={`avg risk · last ${d.sampleSizes.behavioral} events`} />
          <Bar label="Combined" value={d.combined} sub="equal-weight blend" />
        </div>
      )}
    </GlassPanel>
  );
}