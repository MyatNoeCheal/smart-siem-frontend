import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import AsyncState from "../components/ui/AsyncState";
import AttackPathScene from "../components/investigation/AttackPathScene";
import ThreatSummaryHeader from "../components/investigation/ThreatSummaryHeader";
import ThreatDetailsPanel from "../components/investigation/ThreatDetailsPanel";
import ThreatTimeline from "../components/investigation/ThreatTimeline";
import InvestigationActions from "../components/investigation/InvestigationActions";
import { useThreatInvestigation } from "../hooks/useThreatInvestigation";
import { severityToChainDepth } from "../data/threatInvestigationMock";

export default function ThreatInvestigation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { threat, timeline, timelineSource, loading, error, investigationStatus, applyAction, retry } = useThreatInvestigation(id);
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div>
      <PageHeader
        title="Threat Investigation"
        subtitle={id}
        actions={
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-navy-800/60 px-3 py-1.5 text-[12px] text-navy-100 hover:border-command-cyan/30">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        }
      />

      <AsyncState loading={loading} error={error} isEmpty={!loading && !threat} onRetry={retry} emptyLabel={error || "Threat not found."}>
        {threat && (
          <>
            <GlassPanel className="mb-5">
              <ThreatSummaryHeader threat={threat} investigationStatus={investigationStatus} />
            </GlassPanel>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <GlassPanel className="overflow-hidden xl:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-display text-[14px] font-semibold text-navy-50">Attack Path</h2>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-navy-400">
                    {selectedNode ? `selected: ${selectedNode}` : "click a node for detail"}
                  </span>
                </div>
                <AttackPathScene
                  depth={severityToChainDepth(threat.severity)}
                  investigationStatus={investigationStatus}
                  onSelectNode={setSelectedNode}
                  selectedNode={selectedNode}
                />
              </GlassPanel>

              <GlassPanel>
                <h2 className="mb-3 font-display text-[14px] font-semibold text-navy-50">Threat Details</h2>
                <ThreatDetailsPanel threat={threat} />
              </GlassPanel>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
              <GlassPanel className="xl:col-span-2">
                <h2 className="mb-1 font-display text-[14px] font-semibold text-navy-50">Threat Timeline</h2>
                <ThreatTimeline events={timeline} source={timelineSource} />
              </GlassPanel>

              <GlassPanel>
                <h2 className="mb-3 font-display text-[14px] font-semibold text-navy-50">Actions</h2>
                <InvestigationActions currentStatus={investigationStatus} onAction={applyAction} />
              </GlassPanel>
            </div>
          </>
        )}
      </AsyncState>
    </div>
  );
}