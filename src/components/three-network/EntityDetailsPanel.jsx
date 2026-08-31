import { X } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { NODE_TYPES } from "./threatNetworkTheme";

export default function EntityDetailsPanel({ node, onClose }) {
  if (!node) return null;
  const typeDef = NODE_TYPES[node.type];

  const rows = [
    { label: "Entity Type", value: typeDef.label },
    { label: "Risk Score", value: `${node.riskScore} / 100` },
    { label: "Event Count", value: node.eventCount.toLocaleString() },
    { label: "Last Activity", value: node.lastActivity },
  ];

  return (
    <div className="absolute right-3 top-3 z-10 w-64 rounded-xl border border-white/10 bg-navy-900/95 p-4 shadow-glow backdrop-blur-xl sm:w-72">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-display text-[14px] font-semibold text-navy-50">{node.name}</p>
          <div className="mt-1.5">
            <StatusBadge level={node.threatLevel === "normal" ? "low" : node.threatLevel}>
              {node.threatLevel}
            </StatusBadge>
          </div>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-navy-400 hover:bg-white/[0.06] hover:text-navy-50">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2 border-t border-white/[0.06] pt-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-[12px]">
            <span className="text-navy-400">{r.label}</span>
            <span className="font-mono text-navy-50">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}