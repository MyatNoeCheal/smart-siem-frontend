import { UserCog, ShieldAlert, Settings, Users, RefreshCw } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import AsyncState from "../components/ui/AsyncState";
import AdminActivityFilters from "../components/admin-activity/AdminActivityFilters";
import ActivityTimeline from "../components/admin-activity/ActivityTimeline";
import { useAdminActivity } from "../hooks/useAdminActivity";
import { formatNumber } from "../utils/format";

export default function AdminActivity() {
  const {
    loading, source, error, retry, filtered, users, actions, stats,
    search, setSearch, userFilter, setUserFilter, actionFilter, setActionFilter,
    severityFilter, setSeverityFilter, dateFrom, setDateFrom, dateTo, setDateTo,
  } = useAdminActivity();

  return (
    <div>
      <PageHeader
        title="Admin Activity"
        subtitle="Internal & insider misuse monitoring — administrator actions"
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
        <StatCard icon={UserCog} label="Total Actions" value={formatNumber(stats.total)} tone="blue" />
        <StatCard icon={Users} label="Unique Admins" value={formatNumber(stats.uniqueAdmins)} tone="cyan" />
        <StatCard icon={Settings} label="Config Changes" value={formatNumber(stats.configChanges)} tone="violet" />
        <StatCard icon={ShieldAlert} label="Suspicious Activity" value={formatNumber(stats.suspicious)} tone="critical" subtext="high/critical severity" />
      </div>

      <GlassPanel className="mt-5">
        <h2 className="mb-3 font-display text-[14px] font-semibold text-navy-50">Administrative Activity Timeline</h2>
        <AdminActivityFilters
          search={search} onSearch={setSearch}
          users={users} userFilter={userFilter} onUserFilter={setUserFilter}
          actions={actions} actionFilter={actionFilter} onActionFilter={setActionFilter}
          severityFilter={severityFilter} onSeverityFilter={setSeverityFilter}
          dateFrom={dateFrom} onDateFrom={setDateFrom} dateTo={dateTo} onDateTo={setDateTo}
        />
        <AsyncState loading={loading} error={error} isEmpty={!loading && filtered.length === 0} onRetry={retry} emptyLabel="No admin activity matches these filters.">
          <ActivityTimeline items={filtered} />
        </AsyncState>
      </GlassPanel>
    </div>
  );
}