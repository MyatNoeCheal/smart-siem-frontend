import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ShieldAlert, AlertTriangle, CreditCard, Users, Gauge, RefreshCw } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import AsyncState from "../components/ui/AsyncState";
import ThreatTrendChart from "../components/charts/ThreatTrendChart";
import ThreatSeverityChart from "../components/charts/ThreatSeverityChart";
import ThreatNetwork from "../components/three-network/ThreatNetwork";
import LiveThreatMap from "../components/overview/LiveThreatMap";
import AIConfidenceBars from "../components/overview/AIConfidenceBars";
import SystemHealthCard from "../components/overview/SystemHealthCard";
import RecentThreats from "../components/threats/RecentThreats";
import LiveThreatFeed from "../components/threats/LiveThreatFeed";
import AttackSimulationControls from "../components/attack-sim/AttackSimulationControls";
import StageBanner from "../components/attack-sim/StageBanner";
import ThreatDetectedPanel from "../components/attack-sim/ThreatDetectedPanel";
import { useOverviewData } from "../hooks/useOverviewData";
import { useAttackSimulation } from "../hooks/useAttackSimulation";
import { generateThreatNetworkMock } from "../data/threatNetworkMock";
import { getThreats } from "../services/threatService";
import { formatNumber, formatRiskScore } from "../utils/format";

function DeltaTag({ value }) {
  if (value == null) return <span className="text-[11px] text-navy-500">vs 24h ago</span>;
  const up = value >= 0;
  return (
    <span className={`font-mono text-[11px] font-medium ${up ? "text-command-cyan" : "text-risk-critical"}`}>
      {up ? "▲" : "▼"} {Math.abs(value)}% <span className="text-navy-500">vs 24h ago</span>
    </span>
  );
}

export default function Overview() {
  const { loading, source, kpis, deltas, trend, severity, alerts, topEntities, retry } = useOverviewData();
  const { nodes: networkNodes, edges: networkEdges } = useMemo(() => generateThreatNetworkMock(), []);
  const sim = useAttackSimulation();

  const globeNodes = useMemo(
    () => Array.from({ length: 26 }, (_, i) => ({
      id: i,
      severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)],
    })),
    [source] // regenerate the demo scatter once data source settles, not every render
  );

  const [recentThreats, setRecentThreats] = useState({ items: [], loading: true, error: null });
  useEffect(() => {
    let mounted = true;
    getThreats({ limit: 10, group_incidents: true, sort: "priority" }).then((res) => {
      if (!mounted) return;
      setRecentThreats({ items: res.data.items, loading: false, error: res.error });
    });
    return () => { mounted = false; };
  }, [sim.isDetected]);

  const [injectedFeedItems, setInjectedFeedItems] = useState([]);
  const [threatBoost, setThreatBoost] = useState({ active: 0, critical: 0 });
  const handledDetectionRef = useRef(false);

  useEffect(() => {
    if (sim.isDetected && !handledDetectionRef.current) {
      handledDetectionRef.current = true;
      setInjectedFeedItems([{
        id: `sim-${Date.now()}`,
        type: sim.detectedThreat.threatType,
        ip: "checkout-svc · internal",
        severity: "critical",
        riskScore: sim.detectedThreat.riskScore,
        status: "new",
        lastSeen: sim.detectedThreat.timestamp,
      }]);
      setThreatBoost((b) => ({ active: b.active + 1, critical: b.critical + 1 }));
    }
    if (sim.isIdle) { handledDetectionRef.current = false; setInjectedFeedItems([]); }
  }, [sim.isDetected, sim.isIdle, sim.detectedThreat]);

  const handleReset = () => {
    sim.reset();
    setThreatBoost({ active: 0, critical: 0 });
    handledDetectionRef.current = false;
  };

  const displayKpis = {
    ...kpis,
    activeThreats: kpis.activeThreats + threatBoost.active,
    criticalThreats: kpis.criticalThreats + threatBoost.critical,
  };

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Real-time security operations overview"
        actions={
          <>
            <StatusBadge level={source === "live" ? "live" : "mock"}>{source === "live" ? "LIVE" : "MOCK DATA"}</StatusBadge>
            <button onClick={retry} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-navy-800/60 px-3 py-1.5 text-[12px] text-navy-100 hover:border-command-cyan/30">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </>
        }
      />

      {/* TOP — headline KPI row with real deltas where available */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Activity} label="Total Events" value={formatNumber(displayKpis.totalEvents)} tone="blue" trend={deltas.totalEvents != null ? `${deltas.totalEvents >= 0 ? "+" : ""}${deltas.totalEvents}%` : undefined} />
        <StatCard icon={ShieldAlert} label="Active Threats" value={formatNumber(displayKpis.activeThreats)} tone="high" />
        <StatCard icon={AlertTriangle} label="Critical Threats" value={formatNumber(displayKpis.criticalThreats)} tone="critical" />
        <StatCard icon={CreditCard} label="Fraud Cases" value={formatNumber(displayKpis.fraudCases)} tone="violet" />
        <StatCard icon={Users} label="Users Monitored" value={formatNumber(displayKpis.usersMonitored)} tone="cyan" />
        <StatCard icon={Gauge} label="Overall Risk Score" value={formatRiskScore(displayKpis.overallRiskScore)} tone="low" />
      </div>

      {/* Live Threat Map + Live Threat Feed */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
         <LiveThreatMap nodes={globeNodes} topEntities={topEntities} source={source} sim={sim} />
        </div>
        <GlassPanel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[14px] font-semibold text-navy-50">Live Threat Feed</h2>
            <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-risk-low">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-risk-low" /> live
            </span>
          </div>
          <LiveThreatFeed extraItems={injectedFeedItems} />
        </GlassPanel>
      </div>

      {/* AI Confidence + Severity donut + System Health */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <AIConfidenceBars />
        <GlassPanel>
          <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">Alerts by Severity</h2>
          <ThreatSeverityChart data={severity} />
        </GlassPanel>
        <SystemHealthCard />
      </div>

      {/* Threats over time */}
      <GlassPanel className="mt-5">
        <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">Threats Over Time (24h)</h2>
        <ThreatTrendChart data={trend} />
      </GlassPanel>

      {/* Recent High-Severity Alerts */}
      <GlassPanel className="mt-5">
        <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">Recent High Severity Alerts</h2>
        <AsyncState loading={recentThreats.loading} error={recentThreats.error} isEmpty={!recentThreats.loading && recentThreats.items.length === 0} onRetry={retry} emptyLabel="No threats recorded yet.">
          <RecentThreats threats={recentThreats.items} />
        </AsyncState>
      </GlassPanel>

      {/* Cyber Threat Network + Attack Simulation — kept as its own section,
          this app's signature differentiator beyond the reference designs */}
      <GlassPanel className="mt-5 overflow-hidden">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-[14px] font-semibold text-navy-50">Cyber Threat Network</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-navy-400">
              internet → server → user → application → database
            </span>
          </div>
          <AttackSimulationControls isRunning={sim.isRunning} isDetected={sim.isDetected} onSimulate={sim.start} onReset={handleReset} />
        </div>

        {sim.isDetected && <ThreatDetectedPanel threat={sim.detectedThreat} onDismiss={handleReset} />}
        <StageBanner stage={sim.stage} stageIndex={sim.stageIndex} stageCount={sim.stageCount} />

        <ThreatNetwork
          nodes={networkNodes}
          edges={networkEdges}
          height={560}
          nodeOverrides={sim.nodeOverrides}
          attackEdgeIds={sim.attackEdgeIds}
          cameraPulse={sim.cameraPulse}
        />
      </GlassPanel>
    </div>
  );
}