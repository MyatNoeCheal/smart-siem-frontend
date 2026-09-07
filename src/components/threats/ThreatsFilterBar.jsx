import { Search } from "lucide-react";

export default function ThreatsFilterBar({
  search, onSearch, severityFilter, onSeverityFilter,
  statusFilter, onStatusFilter, groupIncidents, onGroupIncidents, sortBy, onSortBy,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-navy-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search IP, type, reason…"
          className="w-full bg-transparent text-[12.5px] text-navy-50 outline-none placeholder:text-navy-500"
        />
      </div>

      <select value={statusFilter} onChange={(e) => onStatusFilter(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none">
        <option value="open">Open</option>
        <option value="new">New</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
        <option value="false_positive">False Positive</option>
        <option value="all">All statuses</option>
      </select>

      <select value={severityFilter} onChange={(e) => onSeverityFilter(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none">
        <option value="all">All severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={sortBy} onChange={(e) => onSortBy(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none">
        <option value="priority">Sort: Priority</option>
        <option value="recency">Sort: Most Recent</option>
        <option value="severity">Sort: Severity</option>
      </select>

      <label className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-100">
        <input type="checkbox" checked={groupIncidents} onChange={(e) => onGroupIncidents(e.target.checked)} className="accent-command-cyan" />
        Group into incidents
      </label>
    </div>
  );
}