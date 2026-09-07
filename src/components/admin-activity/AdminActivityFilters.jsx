import { Search } from "lucide-react";

export default function AdminActivityFilters({
  search, onSearch, users, userFilter, onUserFilter,
  actions, actionFilter, onActionFilter, severityFilter, onSeverityFilter,
  dateFrom, onDateFrom, dateTo, onDateTo,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="flex flex-1 min-w-[200px] items-center gap-2 rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-navy-400" />
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search admin, action, IP…" className="w-full bg-transparent text-[12.5px] text-navy-50 outline-none placeholder:text-navy-500" />
      </div>

      <select value={userFilter} onChange={(e) => onUserFilter(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none">
        <option value="all">All admins</option>
        {users.map((u) => <option key={u} value={u}>{u}</option>)}
      </select>

      <select value={actionFilter} onChange={(e) => onActionFilter(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none">
        <option value="all">All actions</option>
        {actions.map((a) => <option key={a} value={a}>{a.replace(/_/g, " ")}</option>)}
      </select>

      <select value={severityFilter} onChange={(e) => onSeverityFilter(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none">
        <option value="all">All severities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <input type="datetime-local" value={dateFrom} onChange={(e) => onDateFrom(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-2.5 py-2 font-mono text-[11.5px] text-navy-50 outline-none" />
      <span className="text-navy-500">–</span>
      <input type="datetime-local" value={dateTo} onChange={(e) => onDateTo(e.target.value)} className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-2.5 py-2 font-mono text-[11.5px] text-navy-50 outline-none" />
    </div>
  );
}