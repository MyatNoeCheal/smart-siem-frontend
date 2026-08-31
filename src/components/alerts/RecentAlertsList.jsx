import StatusBadge from "../ui/StatusBadge";

export default function RecentAlertsList({ alerts }) {
  if (!alerts?.length) {
    return <p className="py-8 text-center text-[13px] text-navy-400">No recent alerts.</p>;
  }
  return (
    <div className="divide-y divide-white/[0.05]">
      {alerts.map((a) => (
        <div key={a.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-navy-50">{a.type}</p>
            <p className="font-mono text-[11px] text-navy-400">{a.ip}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <StatusBadge level={a.severity} />
            <span className="font-mono text-[11px] text-navy-400">{a.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}