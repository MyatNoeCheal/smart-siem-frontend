import { RefreshCw } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatusBadge from "../components/ui/StatusBadge";
import AsyncState from "../components/ui/AsyncState";
import Pagination from "../components/ui/Pagination";
import LogFilters from "../components/logs/LogFilters";
import LogTable from "../components/logs/LogTable";
import { useLogs } from "../hooks/useLogs";

export default function Logs() {
  const {
    items, total, totalPages, source, loading, error, retry,
    page, setPage, search, setSearch, eventType, setEventType,
    severity, setSeverity, sort, toggleSort, pageSize,
  } = useLogs();

  return (
    <div>
      <PageHeader
        title="Logs"
        subtitle="Full raw event log — server-side paginated"
        actions={
          <>
            <StatusBadge level={source === "live" ? "live" : "mock"}>{source === "live" ? "LIVE DATA" : "MOCK DATA"}</StatusBadge>
            <button onClick={retry} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-navy-800/60 px-3 py-1.5 text-[12px] text-navy-100 hover:border-command-cyan/30">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </>
        }
      />

      <GlassPanel>
        <LogFilters search={search} onSearch={setSearch} eventType={eventType} onEventType={setEventType} severity={severity} onSeverity={setSeverity} />
        <AsyncState loading={loading} error={error} isEmpty={!loading && items.length === 0} onRetry={retry} emptyLabel="No log events found.">
          <LogTable logs={items} sort={sort} onSort={toggleSort} />
        </AsyncState>
        <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onChange={setPage} />
      </GlassPanel>
    </div>
  );
}