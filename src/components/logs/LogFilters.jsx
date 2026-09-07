import { Search } from "lucide-react";

export default function LogFilters({ search, onSearch, eventType, onEventType, severity, onSeverity }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-navy-400" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search IP, user, event type…"
          className="w-full bg-transparent text-[12.5px] text-navy-50 outline-none placeholder:text-navy-500"
        />
      </div>
      <input
        value={eventType}
        onChange={(e) => onEventType(e.target.value)}
        placeholder="Event type"
        className="w-36 rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none placeholder:text-navy-500"
      />
      <select
        value={severity}
        onChange={(e) => onSeverity(e.target.value)}
        className="rounded-lg border border-white/[0.08] bg-navy-900/60 px-3 py-2 text-[12.5px] text-navy-50 outline-none"
      >
        <option value="">All severities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </div>
  );
}