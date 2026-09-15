import { useMemo } from "react";
import { Radar, Radio } from "lucide-react";
import ThreatGlobe from "../three/ThreatGlobe";

const SEVERITY_COLOR = { critical: "#FB4B5D", high: "#F5A623", medium: "#F5D547", low: "#33D69F" };

export default function LiveThreatMap({ nodes, topEntities, source, sim }) {
  const legendCounts = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 };
    nodes.forEach((n) => { c[n.severity] = (c[n.severity] || 0) + 1; });
    return c;
  }, [nodes]);

  const simActive = sim?.isRunning || sim?.isDetected;

  return (
    <div className="viz-dark-surface relative h-full min-h-[380px] w-full">
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
        <span className="flex h-2 w-2 items-center justify-center rounded-full bg-command-cyan">
          <span className="h-2 w-2 animate-ping rounded-full bg-command-cyan" />
        </span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-navy-50">
          Live Threat Map
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">
          {source === "live" ? "live" : "simulated"}
        </span>
      </div>

      {simActive && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-risk-critical/40 bg-risk-critical/10 px-2.5 py-1">
          <Radio className="h-3 w-3 animate-pulse text-risk-critical" />
          <span className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-risk-critical">
            {sim.isDetected ? "Threat Confirmed" : "Attack In Progress"}
          </span>
        </div>
      )}

      <ThreatGlobe nodes={nodes} sim={sim} />

      <div className="absolute bottom-4 left-4 z-10 rounded-lg border border-white/10 bg-navy-900/80 px-3 py-2.5 backdrop-blur-md">
        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-navy-500">Attack Intensity</p>
        <div className="flex flex-col gap-1">
          {(["critical", "high", "medium", "low"]).map((lvl) => (
            <div key={lvl} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: SEVERITY_COLOR[lvl] }} />
              <span className="font-mono text-[9.5px] uppercase text-navy-400">{lvl}</span>
              <span className="ml-auto font-mono text-[9.5px] text-navy-100">{legendCounts[lvl]}</span>
            </div>
          ))}
        </div>
      </div>

      {topEntities?.length > 0 && (
        <div className="absolute bottom-4 right-4 z-10 w-44 rounded-lg border border-white/10 bg-navy-900/80 px-3 py-2.5 backdrop-blur-md">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Radar className="h-3 w-3 text-command-cyan" />
            <p className="font-mono text-[9px] uppercase tracking-wider text-navy-500">Top Sources</p>
          </div>
          <div className="flex flex-col gap-1">
            {topEntities.slice(0, 5).map((e, i) => (
              <div key={e.ip} className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[9.5px] text-navy-100">{i + 1}. {e.ip}</span>
                <span className="font-mono text-[9.5px] text-navy-500">{e.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}