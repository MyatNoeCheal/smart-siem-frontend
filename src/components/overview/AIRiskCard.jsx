import { useEffect, useState } from "react";
import { BrainCircuit } from "lucide-react";
import GlassPanel from "../ui/GlassPanel";
import { getAiConfidence } from "../../services/analyticsService";

function Ring({ value, color, label, sub }) {
  const r = 30, c = 2 * Math.PI * r;
  const pct = value == null ? 0 : Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="7" />
        {value != null && (
          <circle
            cx="38" cy="38" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 38 38)"
            style={{ transition: "stroke-dashoffset .6s ease" }}
          />
        )}
        <text x="38" y="43" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="14" fontWeight="700" fill={color}>
          {value != null ? `${value}%` : "—"}
        </text>
      </svg>
      <div className="-mt-2 text-center">
        <p className="text-[11px] font-medium text-navy-100">{label}</p>
        <p className="text-[9.5px] text-navy-500">{sub}</p>
      </div>
    </div>
  );
}

export default function AIRiskCard() {
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
          <h2 className="font-display text-[14px] font-semibold text-navy-50">AI Risk Assessment</h2>
        </div>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">
          {state.loading ? "scoring…" : state.source === "live" ? "live" : "mock"}
        </span>
      </div>
      {state.loading ? (
        <p className="py-6 text-center text-[12px] text-navy-400">Scoring recent events…</p>
      ) : (
        <div className="flex justify-around">
          <Ring value={d.fraud} color="#5B8CFF" label="Fraud AI" sub={`avg · ${d.sampleSizes.fraud} events`} />
          <Ring value={d.behavioral} color="#8B7CF6" label="Behavioral AI" sub={`avg · ${d.sampleSizes.behavioral} events`} />
          <Ring value={d.combined} color="#22D3EE" label="Combined" sub="equal-weight blend" />
        </div>
      )}
    </GlassPanel>
  );
}