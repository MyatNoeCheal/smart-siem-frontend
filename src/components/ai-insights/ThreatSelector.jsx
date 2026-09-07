import clsx from "clsx";
import StatusBadge from "../ui/StatusBadge";

function riskLevel(score) {
  if (score == null) return "low";
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export default function ThreatSelector({ items, selectedId, onSelect }) {
  if (!items.length) {
    return <p className="py-6 text-center text-[12px] text-navy-400">No explainable items available yet.</p>;
  }
  return (
    <div className="max-h-[360px] space-y-1 overflow-y-auto pr-1">
      {items.map((i) => (
        <button
          key={i.id}
          onClick={() => onSelect(i.id)}
          className={clsx(
            "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
            selectedId === i.id ? "bg-command-cyan/[0.08] ring-1 ring-command-cyan/25" : "hover:bg-white/[0.04]"
          )}
        >
          <span className="truncate text-[12px] text-navy-100">{i.label}</span>
          <StatusBadge level={riskLevel(i.riskScore)}>{i.riskScore ?? "—"}</StatusBadge>
        </button>
      ))}
    </div>
  );
}