import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { getDashboardStats } from "../services/dashboardService";
import { getRecentAlerts } from "../services/threatService";

export function useOverviewData() {
  const [state, setState] = useState({
    loading: true,
    source: "mock",
    kpis: { totalEvents: 0, activeThreats: 0, criticalThreats: 0, fraudCases: 0, usersMonitored: 0, overallRiskScore: 0 },
    deltas: { totalEvents: null, anomalies: null },
    trend: [],
    severity: [],
    alerts: [],
    topEntities: [],
    error: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    const [dashboard, alerts, timeline48, topEntitiesRes] = await Promise.all([
      getDashboardStats(),
      getRecentAlerts(6),
      api.get("/overview/timeline", { params: { hours: 48, buckets: 2 } }).catch(() => null),
      api.get("/overview/top-entities", { params: { scan_limit: 500, top_n: 8 } }).catch(() => null),
    ]);

    let totalEventsDelta = null;
    let anomaliesDelta = null;
    if (timeline48?.data?.total?.length === 2) {
      const [priorTotal, recentTotal] = timeline48.data.total;
      totalEventsDelta = priorTotal > 0 ? Math.round(((recentTotal - priorTotal) / priorTotal) * 1000) / 10 : null;
      const [priorAnom, recentAnom] = timeline48.data.anomalies || [];
      anomaliesDelta = priorAnom > 0 ? Math.round(((recentAnom - priorAnom) / priorAnom) * 1000) / 10 : null;
    }

    const topEntities = (topEntitiesRes?.data?.top_ips || [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map((e) => ({ ip: e.ip, count: e.count, severity: (e.max_level || "low").toLowerCase() }));

    const source = dashboard.source === "live" && alerts.source === "live" ? "live" : "mock";

    setState({
      loading: false,
      source,
      kpis: dashboard.data.kpis,
      deltas: { totalEvents: totalEventsDelta, anomalies: anomaliesDelta },
      trend: dashboard.data.trend,
      severity: dashboard.data.severity,
      alerts: alerts.data,
      topEntities,
      error: dashboard.error || alerts.error || null,
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, retry: load, refetch: load };
}