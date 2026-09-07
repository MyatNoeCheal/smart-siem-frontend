import { useNavigate } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";

function formatTime(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.round(diffMin / 60)}h ago`;
}

function priorityTone(score) {
  if (score == null) return "text-navy-400";
  if (score >= 110) return "text-risk-critical";
  if (score >= 80) return "text-risk-high";
  if (score >= 40) return "text-risk-medium";
  return "text-risk-low";
}

export default function ThreatsQueueTable({ threats, selectedIds, onToggleSelect }) {
  const navigate = useNavigate();

  if (!threats.length) {
    return <p className="py-8 text-center text-[13px] text-navy-400">No threats match these filters.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-navy-400">
            <th className="pb-2.5 font-mono font-normal"></th>
            <th className="pb-2.5 font-mono font-normal">Last Seen</th>
            <th className="pb-2.5 font-mono font-normal">Count</th>
            <th className="pb-2.5 font-mono font-normal">IP</th>
            <th className="pb-2.5 font-mono font-normal">Event Type</th>
            <th className="pb-2.5 font-mono font-normal">Severity</th>
            <th className="pb-2.5 font-mono font-normal">Risk Score</th>
            <th className="pb-2.5 font-mono font-normal">Priority</th>
            <th className="pb-2.5 font-mono font-normal">Status</th>
            <th className="pb-2.5 font-mono font-normal">Reason</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((t) => {
            const isSim = t.id.startsWith("sim-");
            return (
              <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.03]">
                <td className="py-2.5">
                  <input
                    type="checkbox"
                    disabled={isSim}
                    checked={selectedIds.has(t.id)}
                    onChange={() => onToggleSelect(t.id)}
                    className="accent-command-cyan disabled:opacity-30"
                  />
                </td>
                <td className="py-2.5 font-mono text-navy-400">{formatTime(t.lastSeen)}</td>
                <td className="py-2.5 font-mono text-navy-100">{t.count ? `${t.count}×` : "1×"}</td>
                <td className="py-2.5 font-mono text-navy-100">{t.ip}</td>
                <td
                  className={`py-2.5 capitalize ${isSim ? "text-navy-100" : "cursor-pointer text-command-cyan hover:underline"}`}
                  onClick={() => !isSim && navigate(`/threats/${t.id}`)}
                >
                  {t.type} {isSim && <span className="ml-1 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">(simulated)</span>}
                </td>
                <td className="py-2.5"><StatusBadge level={t.severity}>{t.severity}</StatusBadge></td>
                <td className="py-2.5 font-mono text-navy-100">{t.riskScore ?? "—"}</td>
                <td className={`py-2.5 font-mono font-semibold ${priorityTone(t.priorityScore)}`}>{t.priorityScore ?? "—"}</td>
                <td className="py-2.5 capitalize text-navy-400">{(t.status || "new").replace("_", " ")}</td>
                <td className="max-w-xs truncate py-2.5 text-navy-500">{(t.reason || []).join(", ") || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}