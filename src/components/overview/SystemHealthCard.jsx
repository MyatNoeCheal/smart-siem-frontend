import { useEffect, useState } from "react";
import { Activity, Database, Cpu, Wifi, WifiOff } from "lucide-react";
import GlassPanel from "../ui/GlassPanel";
import { getSystemHealth } from "../../services/systemHealthService";

const POLL_MS = 15000;

export default function SystemHealthCard() {
  const [state, setState] = useState({ data: null, loading: true });

  useEffect(() => {
    let mounted = true;
    const check = () => getSystemHealth().then((res) => mounted && setState({ ...res, loading: false }));
    check();
    const id = setInterval(check, POLL_MS);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const d = state.data;
  const online = d?.apiOnline;

  const rows = [
    { icon: online ? Wifi : WifiOff, label: "FastAPI Backend", value: online ? `Online · ${d.latencyMs}ms` : "Unreachable", ok: online },
    { icon: Database, label: "MongoDB (inferred)", value: online ? "Connected" : "Unknown", ok: online },
    { icon: Cpu, label: "AI Models (inferred)", value: online ? "Loaded" : "Unknown", ok: online },
  ];

  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-risk-low" />
          <h2 className="font-display text-[14px] font-semibold text-navy-50">System Health</h2>
        </div>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">
          {state.loading ? "checking…" : `polled every ${POLL_MS / 1000}s`}
        </span>
      </div>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[12px] text-navy-100/85">
              <r.icon className={`h-3.5 w-3.5 ${r.ok ? "text-risk-low" : "text-risk-critical"}`} />
              {r.label}
            </div>
            <span className={`font-mono text-[11px] ${r.ok ? "text-risk-low" : "text-risk-critical"}`}>{r.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[10px] leading-relaxed text-navy-500">
        Database and AI model rows are inferred from API reachability, not individually reported by /health.
      </p>
    </GlassPanel>
  );
}