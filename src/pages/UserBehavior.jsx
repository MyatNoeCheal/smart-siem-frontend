import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatusBadge from "../components/ui/StatusBadge";
import UserNetworkScene from "../components/user-network/UserNetworkScene";
import RiskFilterBar from "../components/user-network/RiskFilterBar";
import UserSearchBox from "../components/user-network/UserSearchBox";
import UserDetailPanel from "../components/user-behavior/UserDetailPanel";
import UserBehaviorTimeline from "../components/user-behavior/UserBehaviorTimeline";
import { useUserNetwork } from "../hooks/useUserNetwork";
import { useUserDetail } from "../hooks/useUserDetail";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

export default function UserBehavior() {
  const { nodes, edges, source, loading, riskFilter, setRiskFilter, searchQuery, setSearchQuery, visibleNodeIds, retry } = useUserNetwork();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const detail = useUserDetail(selectedUserId);

  return (
    <div>
      <PageHeader
        title="User Behavior"
        subtitle="Insider-threat & abnormal behavior detection — user relationship network"
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

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <RiskFilterBar value={riskFilter} onChange={setRiskFilter} />
        <UserSearchBox value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassPanel className="overflow-hidden xl:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-[14px] font-semibold text-navy-50">User Relationship Network</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-navy-400">
              {loading ? "loading…" : `${nodes.length} users`}
            </span>
          </div>
          <UserNetworkScene nodes={nodes} edges={edges} visibleNodeIds={visibleNodeIds} onSelectUser={setSelectedUserId} selectedUserId={selectedUserId} />
        </GlassPanel>

        <GlassPanel>
          <h2 className="mb-3 font-display text-[14px] font-semibold text-navy-50">Selected User</h2>
          <UserDetailPanel user={detail.data} source={detail.source} loading={detail.loading} />
        </GlassPanel>
      </div>

      <GlassPanel className="mt-5">
        <h2 className="mb-1 font-display text-[14px] font-semibold text-navy-50">User Behavior Timeline</h2>
        <p className="mb-3 text-[11px] text-navy-500">High and critical-severity events are highlighted as unusual activity.</p>
        <UserBehaviorTimeline events={detail.data?.timeline} />
      </GlassPanel>
    </div>
  );
}