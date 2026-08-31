import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { getThreats } from "../../services/threatService";

const POLL_MS = 8000;

function formatTime(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  const diffMin = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  return `${Math.round(diffMin / 60)}h`;
}

export default function LiveThreatFeed({ extraItems = [] }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const poll = () => {
      getThreats({ limit: 12, group_incidents: true, sort: "recency" }).then((res) => {
        if (!mounted) return;
        setItems(res.data.items);
        setLoading(false);
      });
    };
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const combined = [...extraItems, ...items].slice(0, 14);

  if (loading) return <p className="py-8 text-center text-[12px] text-navy-400">Connecting to feed…</p>;
  if (!combined.length) return <p className="py-8 text-center text-[13px] text-navy-400">No live activity yet.</p>;

  const dotColor = { critical: "bg-risk-critical", high: "bg-risk-high", medium: "bg-risk-medium", low: "bg-risk-low" };

  return (
    <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
      {combined.map((t) => (
        <button
          key={t.id}
          onClick={() => navigate(`/threats/${t.id}`)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/[0.04]"
        >
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[t.severity] || dotColor.low}`} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] text-navy-50">{t.type}</p>
            <p className="truncate font-mono text-[10px] text-navy-500">{t.ip} · risk {t.riskScore ?? "—"}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <StatusBadge level={t.severity} />
            <span className="font-mono text-[9.5px] text-navy-500">{formatTime(t.lastSeen)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}