import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatusBadge from "../components/ui/StatusBadge";
import AsyncState from "../components/ui/AsyncState";
import { getThreats } from "../services/threatService";

export default function ThreatInvestigation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ threat: null, loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    getThreats({ limit: 200, group_incidents: true }).then((res) => {
      if (!mounted) return;
      const match = res.data.items.find((t) => t.id === id);
      setState({
        threat: match || null,
        loading: false,
        error: match ? null : "Threat not found in the current window — it may have been resolved or aged out.",
      });
    });
    return () => { mounted = false; };
  }, [id]);

  return (
    <div>
      <PageHeader
        title="Threat Investigation"
        subtitle={id}
        actions={
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-navy-800/60 px-3 py-1.5 text-[12px] text-navy-100 hover:border-command-cyan/30">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        }
      />

      <AsyncState
        loading={state.loading}
        error={state.error}
        isEmpty={!state.loading && !state.threat}
        onRetry={() => window.location.reload()}
        emptyLabel={state.error}
      >
        {state.threat && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <GlassPanel className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-risk-critical/10 ring-1 ring-risk-critical/25">
                  <ShieldAlert className="h-5 w-5 text-risk-critical" />
                </span>
                <div>
                  <p className="font-display text-[16px] font-semibold capitalize text-navy-50">{state.threat.type}</p>
                  <StatusBadge level={state.threat.severity} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  ["Source IP", state.threat.ip],
                  ["Risk Score", state.threat.riskScore ?? "—"],
                  ["Priority Score", state.threat.priorityScore ?? "—"],
                  ["Status", state.threat.status ?? "—"],
                  ["Occurrences", state.threat.count],
                  ["Last Seen", state.threat.lastSeen ?? "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">{label}</p>
                    <p className="mt-0.5 font-mono text-[13px] text-navy-50">{String(value)}</p>
                  </div>
                ))}
              </div>
              {state.threat.reason?.length > 0 && (
                <div className="mt-5 border-t border-white/[0.06] pt-4">
                  <p className="mb-2 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Detection Reasons</p>
                  <ul className="space-y-1">
                    {state.threat.reason.map((r, i) => (
                      <li key={i} className="text-[12.5px] text-navy-100/80">— {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </GlassPanel>

            <GlassPanel>
              <p className="mb-2 font-display text-[13px] font-semibold text-navy-50">Next Steps</p>
              <p className="text-[12px] leading-relaxed text-navy-400">
                Case management, MITRE mapping, and threat-intel enrichment for this alert are available via your
                backend's <code className="rounded bg-navy-800 px-1">/cases</code> and <code className="rounded bg-navy-800 px-1">/threats</code>{" "}
                endpoints — wiring this panel to them is a good next build step.
              </p>
            </GlassPanel>
          </div>
        )}
      </AsyncState>
    </div>
  );
}