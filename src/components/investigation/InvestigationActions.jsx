import { Eye, CheckCircle2, ArrowUpCircle } from "lucide-react";
import clsx from "clsx";

const ACTIONS = [
  { key: "investigating", label: "Mark Investigating", icon: Eye, style: "border-command-cyan/30 bg-command-cyan/10 text-command-cyan hover:bg-command-cyan/20" },
  { key: "resolved", label: "Resolve", icon: CheckCircle2, style: "border-risk-low/30 bg-risk-low/10 text-risk-low hover:bg-risk-low/20" },
  { key: "escalated", label: "Escalate", icon: ArrowUpCircle, style: "border-risk-critical/30 bg-risk-critical/10 text-risk-critical hover:bg-risk-critical/20" },
];

export default function InvestigationActions({ currentStatus, onAction }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {ACTIONS.map((a) => (
        <button
          key={a.key}
          onClick={() => onAction(a.key, a.label)}
          disabled={currentStatus === a.key}
          className={clsx(
            "flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-[11.5px] font-semibold uppercase tracking-wider transition-colors",
            currentStatus === a.key ? "cursor-not-allowed border-white/[0.06] text-navy-500" : a.style
          )}
        >
          <a.icon className="h-3.5 w-3.5" />
          {a.label}
        </button>
      ))}
      <p className="w-full pt-1 text-[10.5px] text-navy-500">
        Updates this session's view only — no traffic is blocked and nothing is written back to the backend yet.
      </p>
    </div>
  );
}