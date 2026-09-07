import { useState } from "react";
import { Cpu, Target, AlertTriangle, Gauge, RefreshCw } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import AsyncState from "../components/ui/AsyncState";
import ThreatTrendChart from "../components/charts/ThreatTrendChart";
import ModelOverviewCard from "../components/ai-insights/ModelOverviewCard";
import ConfidenceDistributionChart from "../components/ai-insights/ConfidenceDistributionChart";
import ThreatSelector from "../components/ai-insights/ThreatSelector";
import ExplainabilityPanel from "../components/ai-insights/ExplainabilityPanel";
import { useAiInsights } from "../hooks/useAiInsights";
import { formatNumber } from "../utils/format";

export default function AIInsights() {
  const { loading, source, models, stats, confidenceHistogram, trend, explainableItems, error, retry } = useAiInsights();
  const [selectedId, setSelectedId] = useState(null);
  const selectedItem = explainableItems.find((i) => i.id === selectedId) || null;

  return (
    <div>
      <PageHeader
        title="AI Model Insights"
        subtitle="How Smart SIEM's detection models work, and why a given item was flagged"
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

      <GlassPanel className="mb-5">
        <h2 className="mb-3 font-display text-[14px] font-semibold text-navy-50">AI Model Overview</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {models.map((m) => <ModelOverviewCard key={m.id} model={m} />)}
        </div>
      </GlassPanel>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Cpu} label="Total Predictions" value={formatNumber(stats.totalPredictions)} tone="blue" />
        <StatCard icon={AlertTriangle} label="Anomalies Detected" value={formatNumber(stats.anomaliesDetected)} tone="high" />
        <StatCard icon={Target} label="High-Risk Predictions" value={formatNumber(stats.highRiskPredictions)} tone="critical" subtext="risk score ≥ 70" />
        <StatCard icon={Gauge} label="Average Confidence" value={`${stats.avgConfidence}%`} tone="violet" subtext="estimated from risk score" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <GlassPanel>
          <h2 className="mb-1 font-display text-[14px] font-semibold text-navy-50">AI Confidence Distribution</h2>
          <p className="mb-2 text-[11px] text-navy-500">Estimated confidence across recently scored transactions and threats.</p>
          <ConfidenceDistributionChart data={confidenceHistogram} />
        </GlassPanel>
        <GlassPanel>
          <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">AI Detection Timeline</h2>
          <ThreatTrendChart data={trend} />
        </GlassPanel>
      </div>

      <GlassPanel className="mt-5">
        <h2 className="mb-1 font-display text-[14px] font-semibold text-navy-50">Explainable AI</h2>
        <p className="mb-4 text-[11px] text-navy-500">Select a flagged item to see exactly why the system flagged it.</p>
        <AsyncState loading={loading} error={error} isEmpty={!loading && explainableItems.length === 0} onRetry={retry} emptyLabel="No explainable items yet.">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-1">
              <ThreatSelector items={explainableItems} selectedId={selectedId} onSelect={setSelectedId} />
            </div>
            <div className="border-t border-white/[0.06] pt-4 xl:col-span-2 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
              <ExplainabilityPanel item={selectedItem} />
            </div>
          </div>
        </AsyncState>
      </GlassPanel>
    </div>
  );
}