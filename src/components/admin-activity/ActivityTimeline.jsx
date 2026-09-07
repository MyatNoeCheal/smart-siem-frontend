import clsx from "clsx";

const SEVERITY_COLOR = { low: "#5B8CFF", medium: "#F5D547", high: "#F5A623", critical: "#FB4B5D" };

export default function ActivityTimeline({ items }) {
  if (!items?.length) {
    return <p className="py-8 text-center text-[12.5px] text-navy-400">No activity matches these filters.</p>;
  }

  return (
    <div className="max-h-[560px] overflow-y-auto pr-1">
      {items.map((e, i) => {
        const unusual = e.severity === "high" || e.severity === "critical";
        const color = SEVERITY_COLOR[e.severity] || SEVERITY_COLOR.low;
        return (
          <div key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={clsx("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", unusual && "ring-2")}
                style={{ background: color, boxShadow: unusual ? `0 0 0 3px ${color}33` : "none" }}
              />
              {i < items.length - 1 && <span className="w-px flex-1 bg-white/[0.08]" />}
            </div>
            <div className={clsx("pb-4", unusual && "rounded-md border-l-2 border-risk-critical/40 pl-3")}>
              <div className="flex flex-wrap items-baseline gap-2">
                <p className={clsx("text-[13px]", unusual ? "font-semibold text-navy-50" : "text-navy-100/85")}>
                  {e.userId} · <span className="capitalize">{e.eventType.replace(/_/g, " ")}</span>
                </p>
                {unusual && <span className="font-mono text-[9.5px] uppercase tracking-wider text-risk-critical">unusual</span>}
                {e.mitre && (
                  <a href={e.mitre.url} target="_blank" rel="noopener noreferrer" className="rounded bg-command-cyan/10 px-1.5 py-0.5 font-mono text-[9.5px] text-command-cyan hover:underline">
                    {e.mitre.technique_id}
                  </a>
                )}
              </div>
              <p className="mt-0.5 font-mono text-[11px] text-navy-500">
                {e.timestamp ? new Date(e.timestamp).toLocaleString() : "—"} · <code className="text-navy-400">{e.ip}</code>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}