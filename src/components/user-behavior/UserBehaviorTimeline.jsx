import clsx from "clsx";

const SEVERITY_COLOR = { low: "#5B8CFF", medium: "#F5D547", high: "#F5A623", critical: "#FB4B5D" };

export default function UserBehaviorTimeline({ events }) {
  if (!events?.length) {
    return <p className="py-8 text-center text-[12.5px] text-navy-400">Select a user to see their activity timeline.</p>;
  }

  return (
    <div>
      {events.map((e, i) => {
        const unusual = e.severity === "high" || e.severity === "critical";
        const color = SEVERITY_COLOR[e.severity] || SEVERITY_COLOR.low;
        return (
          <div key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={clsx("h-2.5 w-2.5 shrink-0 rounded-full", unusual && "ring-2")} style={{ background: color, boxShadow: unusual ? `0 0 0 3px ${color}33` : "none" }} />
              {i < events.length - 1 && <span className="w-px flex-1 bg-white/[0.08]" />}
            </div>
            <div className={clsx("pb-4", unusual && "rounded-md border-l-2 pl-3", unusual && "border-risk-critical/40")}>
              <p className="font-mono text-[11px] text-navy-500">
                {e.timestamp ? new Date(e.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
              </p>
              <p className={clsx("text-[13px]", unusual ? "font-medium text-navy-50" : "text-navy-100/85")}>
                {e.label} {unusual && <span className="ml-1 font-mono text-[9.5px] uppercase tracking-wider text-risk-critical">unusual</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}