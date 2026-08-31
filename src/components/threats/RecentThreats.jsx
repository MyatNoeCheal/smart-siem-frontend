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

export default function RecentThreats({ threats }) {
  const navigate = useNavigate();

  if (!threats?.length) {
    return <p className="py-8 text-center text-[13px] text-navy-400">No threats recorded yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-navy-400">
            <th className="pb-2.5 font-mono font-normal">Time</th>
            <th className="pb-2.5 font-mono font-normal">Severity</th>
            <th className="pb-2.5 font-mono font-normal">Type</th>
            <th className="pb-2.5 font-mono font-normal">Source</th>
            <th className="pb-2.5 font-mono font-normal">Risk Score</th>
            <th className="pb-2.5 font-mono font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((t) => (
            <tr key={t.id} onClick={() => navigate(`/threats/${t.id}`)} className="cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.03]">
              <td className="py-2.5 font-mono text-navy-400">{formatTime(t.lastSeen)}</td>
              <td className="py-2.5"><StatusBadge level={t.severity} /></td>
              <td className="py-2.5 capitalize text-navy-50">{t.type}</td>
              <td className="py-2.5 font-mono text-navy-400">{t.ip}</td>
              <td className="py-2.5 font-mono text-navy-100">{t.riskScore ?? "—"}</td>
              <td className="py-2.5 text-navy-400">{t.status || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}