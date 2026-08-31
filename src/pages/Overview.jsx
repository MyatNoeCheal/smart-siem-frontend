import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ShieldAlert, AlertTriangle, CreditCard, Users, Gauge, RefreshCw, Radio } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import GlassPanel from "../components/ui/GlassPanel";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import AsyncState from "../components/ui/AsyncState";
import ThreatTrendChart from "../components/charts/ThreatTrendChart";
import ThreatSeverityChart from "../components/charts/ThreatSeverityChart";
import ThreatTypesChart from "../components/charts/ThreatTypesChart";
import AIConfidenceChart from "../components/charts/AIConfidenceChart";
import ThreatNetwork from "../components/three-network/ThreatNetwork";
import LiveThreatFeed from "../components/threats/LiveThreatFeed";
import RecentThreats from "../components/threats/RecentThreats";
import AIRiskCard from "../components/overview/AIRiskCard";
import SystemHealthCard from "../components/overview/SystemHealthCard";
import AttackSimulationControls from "../components/attack-sim/AttackSimulationControls";
import StageBanner from "../components/attack-sim/StageBanner";
import ThreatDetectedPanel from "../components/attack-sim/ThreatDetectedPanel";
import { useOverviewData } from "../hooks/useOverviewData";
import { useAttackSimulation } from "../hooks/useAttackSimulation";
import { generateThreatNetworkMock } from "../data/threatNetworkMock";
import { getThreats } from "../services/threatService";
import { formatNumber, formatRiskScore } from "../utils/format";

export default function Overview() {
  const { loading, source, kpis, trend, severity, retry } = useOverviewData();
  const { nodes, edges } = useMemo(() => generateThreatNetworkMock(), []);
  const sim = useAttackSimulation();

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
      setInjectedFeedItems([
        {
          id: `sim-${Date.now()}`,
          type: sim.detectedThreat.threatType,
          ip: "checkout-svc · internal",
          severity: "critical",
          riskScore: sim.detectedThreat.riskScore,
          status: "new",
          lastSeen: sim.detectedThreat.timestamp,
        },
      ]);
      setThreatBoost((b) => ({ active: b.active + 1, critical: b.critical + 1 }));
    }
    if (sim.isIdle) {
      handledDetectionRef.current = false;
      setInjectedFeedItems([]);
    }
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

  const displayTrend = useMemo(() => {
    if (!sim.isDetected || !trend.length) return trend;
    return trend.map((point, i) =>
      i === trend.length - 1 ? { ...point, anomalies: point.anomalies + 18, events: point.events + 6 } : point
    );
  }, [trend, sim.isDetected]);

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Real-time security posture across the e-commerce platform"
        actions={
          <>
            <StatusBadge level={source === "live" ? "live" : "mock"}>{source === "live" ? "LIVE DATA" : "MOCK DATA"}</StatusBadge>
            <button onClick={retry} className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-navy-800/60 px-3 py-1.5 text-[12px] text-navy-100 hover:border-command-cyan/30">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <AttackSimulationControls isRunning={sim.isRunning} isDetected={sim.isDetected} onSimulate={sim.start} onReset={handleReset} />
          </>
        }
      />

      {/* Critical detections always render first, above everything else --
          deliberate: on a projector, the most important state must never
          require scrolling to see. */}
      {sim.isDetected && <ThreatDetectedPanel threat={sim.detectedThreat} onDismiss={handleReset} />}

      {/* TOP -- headline stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Activity} label="Total Events" value={formatNumber(displayKpis.totalEvents)} tone="blue" />
        <StatCard icon={ShieldAlert} label="Active Threats" value={formatNumber(displayKpis.activeThreats)} tone="high" />
        <StatCard icon={AlertTriangle} label="Critical Threats" value={formatNumber(displayKpis.criticalThreats)} tone="critical" />
        <StatCard icon={CreditCard} label="Fraud Cases" value={formatNumber(displayKpis.fraudCases)} tone="violet" />
        <StatCard icon={Users} label="Users Monitored" value={formatNumber(displayKpis.usersMonitored)} tone="cyan" />
        <StatCard icon={Gauge} label="Overall Risk Score" value={formatRiskScore(displayKpis.overallRiskScore)} tone="low" />
      </div>

      {/* Quick AI + system snapshot -- compact, doesn't compete with the stat row */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AIRiskCard />
        <SystemHealthCard />
      </div>

      {/* CENTER + RIGHT -- large network visualization, live feed alongside */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassPanel className="overflow-hidden xl:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-[14px] font-semibold text-navy-50">Cyber Threat Network</h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-navy-400">
              internet → server → user → application → database
            </span>
          </div>
          <StageBanner stage={sim.stage} stageIndex={sim.stageIndex} stageCount={sim.stageCount} />
          <ThreatNetwork
            nodes={nodes}
            edges={edges}
            height={460}
            nodeOverrides={sim.nodeOverrides}
            attackEdgeIds={sim.attackEdgeIds}
            cameraPulse={sim.cameraPulse}
          />
        </GlassPanel>

        <GlassPanel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[14px] font-semibold text-navy-50">Live Threat Feed</h2>
            <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-risk-low">
              <Radio className="h-3 w-3 animate-pulse" /> live
            </span>
          </div>
          <LiveThreatFeed extraItems={injectedFeedItems} />
        </GlassPanel>
      </div>

      {/* BOTTOM -- charts and analytics */}
      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <GlassPanel className="xl:col-span-2">
          <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">Threats Over Time</h2>
          <ThreatTrendChart data={displayTrend} />
        </GlassPanel>
        <GlassPanel>
          <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">Severity Distribution</h2>
          <ThreatSeverityChart data={severity} />
        </GlassPanel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <GlassPanel>
          <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">Threat Types</h2>
          <ThreatTypesChart />
        </GlassPanel>
        <GlassPanel>
          <h2 className="mb-1 font-display text-[14px] font-semibold text-navy-50">AI Detection Confidence</h2>
          <p className="mb-2 text-[11px] text-navy-500">Average risk score across recently scored events, per model.</p>
          <AIConfidenceChart />
        </GlassPanel>
      </div>

      <GlassPanel className="mt-5">
        <h2 className="mb-4 font-display text-[14px] font-semibold text-navy-50">Recent Threats</h2>
        <AsyncState
          loading={recentThreats.loading}
          error={recentThreats.error}
          isEmpty={!recentThreats.loading && recentThreats.items.length === 0}
          onRetry={retry}
          emptyLabel="No threats recorded yet."
        >
          <RecentThreats threats={recentThreats.items} />
        </AsyncState>
      </GlassPanel>
    </div>
  );
}