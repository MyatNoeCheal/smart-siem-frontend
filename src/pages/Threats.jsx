import { ShieldAlert, AlertTriangle, Flame, Inbox, RefreshCw } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import AsyncState from "../components/ui/AsyncState";
import ThreatsFilterBar from "../components/threats/ThreatsFilterBar";
import ThreatsQueueTable from "../components/threats/ThreatsQueueTable";
import { useThreatsQueue } from "../hooks/useThreatsQueue";
import { formatNumber } from "../utils/format";

export default function Threats() {
  const {
    filtered, stats, source, loading, error, retry,
    search, setSearch, severityFilter, setSeverityFilter,
    statusFilter, setStatusFilter, groupIncidents, setGroupIncidents,
    sortBy, setSortBy, selectedIds, toggleSelect, clearSelection, updateStatus, actionError,
  } = useThreatsQueue();

  const selectedCount = selectedIds.size;

  return (
    <div>
      <PageHeader
        title="Threats"
        subtitle="Correlated threat & incident queue"
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Inbox} label="Threats in View" value={formatNumber(stats.total)} tone="blue" />
        <StatCard icon={ShieldAlert} label="Critical" value={formatNumber(stats.critical)} tone="critical" />
        <StatCard icon={AlertTriangle} label="High" value={formatNumber(stats.high)} tone="high" />
        <StatCard icon={Flame} label="Unassigned / New" value={formatNumber(stats.unassignedOpen)} tone="violet" />
      </div>

      <GlassPanel className="mt-5">
        <ThreatsFilterBar
          search={search} onSearch={setSearch}
          severityFilter={severityFilter} onSeverityFilter={setSeverityFilter}
          statusFilter={statusFilter} onStatusFilter={setStatusFilter}
          groupIncidents={groupIncidents} onGroupIncidents={setGroupIncidents}
          sortBy={sortBy} onSortBy={setSortBy}
        />

        {selectedCount > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border border-command-cyan/25 bg-command-cyan/[0.06] px-3 py-2">
            <span className="font-mono text-[11.5px] text-navy-100">{selectedCount} selected</span>
            <button onClick={() => updateStatus(selectedIds, "investigating")} className="rounded-md border border-white/[0.08] bg-navy-800/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-navy-100 hover:border-command-cyan/30">
              Mark Investigating
            </button>
            <button onClick={() => updateStatus(selectedIds, "resolved")} className="rounded-md border border-white/[0.08] bg-navy-800/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-navy-100 hover:border-command-cyan/30">
              Resolve
            </button>
            <button onClick={() => updateStatus(selectedIds, "false_positive")} className="rounded-md border border-white/[0.08] bg-navy-800/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-navy-100 hover:border-command-cyan/30">
              False Positive
            </button>
            <button onClick={clearSelection} className="ml-auto font-mono text-[10.5px] text-navy-500 hover:text-navy-100">Clear</button>
          </div>
        )}
        {actionError && <p className="mb-3 text-[11.5px] text-risk-critical">{actionError}</p>}

        <AsyncState loading={loading} error={error} isEmpty={!loading && filtered.length === 0} onRetry={retry} emptyLabel="No threats match these filters.">
          <ThreatsQueueTable threats={filtered} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
        </AsyncState>
      </GlassPanel>
    </div>
  );
}