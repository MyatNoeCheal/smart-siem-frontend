import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import GlassPanel from "../../components/ui/GlassPanel";
import { API_BASE_URL } from "../../services/api";
import { getDashboardStats } from "../../services/dashboardService";
import { getThreats, getRecentAlerts } from "../../services/threatService";
import { getLogs } from "../../services/logService";
import { getFraudDetections } from "../../services/fraudService";
import { getUserBehavior } from "../../services/userService";
import { getAdminActivity } from "../../services/adminService";
import { getAiInsights } from "../../services/aiInsightsService";

const CHECKS = [
  { label: "Dashboard Stats", endpoint: "/overview + /overview/timeline", run: getDashboardStats },
  { label: "Threats", endpoint: "/threats", run: () => getThreats({ limit: 5 }) },
  { label: "Recent Alerts", endpoint: "/threats (open, grouped)", run: () => getRecentAlerts(5) },
  { label: "Logs", endpoint: "/logs", run: () => getLogs({ page: 1, page_size: 5 }) },
  { label: "Fraud Detections", endpoint: "/fraud", run: () => getFraudDetections() },
  { label: "User Behavior", endpoint: "/user-behavior", run: () => getUserBehavior() },
  { label: "Admin Activity", endpoint: "/admin-activity", run: () => getAdminActivity() },
  { label: "AI Insights", endpoint: "/ai-insights", run: getAiInsights },
];

export default function ApiDiagnostics() {
  const [results, setResults] = useState(CHECKS.map((c) => ({ ...c, status: "pending" })));

  const runAll = async () => {
    setResults(CHECKS.map((c) => ({ ...c, status: "pending" })));
    const settled = await Promise.all(
      CHECKS.map(async (c) => {
        try {
          const res = await c.run();
          return { ...c, status: res.source, error: res.error };
        } catch (e) {
          return { ...c, status: "failed", error: e.message };
        }
      })
    );
    setResults(settled);
  };

  useEffect(() => {
    runAll();
  }, []);

  const liveCount = results.filter((r) => r.status === "live").length;

  return (
    <div>
      <PageHeader
        title="API Diagnostics"
        subtitle={`Backend: ${API_BASE_URL}`}
        actions={
          <button
            onClick={runAll}
            className="rounded-lg border border-white/[0.08] bg-navy-800/60 px-3 py-1.5 text-[12px] text-navy-100 hover:border-command-cyan/30"
          >
            Re-run all checks
          </button>
        }
      />

      <GlassPanel className="mb-4">
        <p className="text-[13px] text-navy-100/80">
          <span className="font-mono text-command-cyan">{liveCount}</span> / {results.length} services returning live
          data. Anything not "live" is falling back to labeled mock data — check the browser console for the
          <code className="mx-1 rounded bg-navy-700/60 px-1.5 py-0.5 font-mono text-[11px]">[MOCK FALLBACK]</code>
          reason.
        </p>
      </GlassPanel>

      <GlassPanel>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-navy-400">
              <th className="pb-2 font-mono">Service</th>
              <th className="pb-2 font-mono">Endpoint</th>
              <th className="pb-2 font-mono">Status</th>
              <th className="pb-2 font-mono">Detail</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.label} className="border-b border-white/[0.04]">
                <td className="py-2.5 text-navy-50">{r.label}</td>
                <td className="py-2.5 font-mono text-[11.5px] text-navy-400">{r.endpoint}</td>
                <td className="py-2.5">
                  <StatusPill status={r.status} />
                </td>
                <td className="py-2.5 max-w-xs truncate text-[11.5px] text-navy-400">{r.error || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  );
}

function StatusPill({ status }) {
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-navy-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> checking…
      </span>
    );
  if (status === "live")
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-risk-low">
        <CheckCircle2 className="h-3.5 w-3.5" /> LIVE
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-command-violet">
      <XCircle className="h-3.5 w-3.5" /> MOCK
    </span>
  );
}