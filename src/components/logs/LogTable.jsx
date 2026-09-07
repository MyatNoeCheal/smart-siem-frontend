import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, ShieldAlert } from "lucide-react";
import clsx from "clsx";
import StatusBadge from "../ui/StatusBadge";
import LogDetails from "./LogDetails";

function SortHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey;
  const Icon = active ? (sort.dir === "asc" ? ChevronUp : ChevronDown) : ChevronsUpDown;
  return (
    <th className="cursor-pointer select-none pb-2.5 font-mono font-normal" onClick={() => onSort(sortKey)}>
      <span className="flex items-center gap-1">
        {label}
        <Icon className={clsx("h-3 w-3", active ? "text-command-cyan" : "text-navy-600")} />
      </span>
    </th>
  );
}

export default function LogTable({ logs, sort, onSort }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!logs.length) {
    return <p className="py-8 text-center text-[13px] text-navy-400">No log events match these filters.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-navy-400">
            <th className="pb-2.5 font-mono font-normal"></th>
            <SortHeader label="Timestamp" sortKey="timestamp" sort={sort} onSort={onSort} />
            <th className="pb-2.5 font-mono font-normal">Event ID</th>
            <th className="pb-2.5 font-mono font-normal">User</th>
            <th className="pb-2.5 font-mono font-normal">Source</th>
            <th className="pb-2.5 font-mono font-normal">Destination</th>
            <th className="pb-2.5 font-mono font-normal">Event Type</th>
            <SortHeader label="Severity" sortKey="severity" sort={sort} onSort={onSort} />
            <SortHeader label="Risk Score" sortKey="riskScore" sort={sort} onSort={onSort} />
            <th className="pb-2.5 font-mono font-normal">Status</th>
          </tr>
        </thead>
                <tbody>
          {logs.map((log) => {
            const expanded = expandedId === log.id;
            return (
              <React.Fragment key={log.id}>
                <tr
                  onClick={() => setExpandedId(expanded ? null : log.id)}
                  className={clsx("cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.03]", expanded && "bg-command-cyan/[0.05]")}
                >
                  <td className="py-2.5 text-navy-500">{expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</td>
                  <td className="py-2.5 font-mono text-navy-400">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}</td>
                  <td className="py-2.5 font-mono text-navy-500">{log.id}</td>
                  <td className="py-2.5 text-navy-50">{log.userId || "unauthenticated"}</td>
                  <td className="py-2.5 font-mono text-navy-100">{log.ip}</td>
                  <td className="py-2.5 font-mono text-navy-400">{log.destination || "—"}</td>
                  <td className="py-2.5 capitalize text-navy-100">{log.eventType.replace(/_/g, " ")}</td>
                  <td className="py-2.5"><StatusBadge level={log.severity}>{log.severity}</StatusBadge></td>
                  <td className="py-2.5 font-mono text-navy-100">{log.riskScore ?? "—"}</td>
                  <td className="py-2.5">
                    {log.anomaly ? (
                      <span className="flex items-center gap-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-risk-critical">
                        <ShieldAlert className="h-3 w-3" /> Anomaly
                      </span>
                    ) : (
                      <span className="font-mono text-[10.5px] text-navy-500">Normal</span>
                    )}
                  </td>
                </tr>
                {expanded && (
                  <tr>
                    <td colSpan={10} className="p-0">
                      <LogDetails log={log} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-[10px] text-navy-500">Sorting applies to the current page only (server does not sort across pages).</p>
    </div>
  );
}