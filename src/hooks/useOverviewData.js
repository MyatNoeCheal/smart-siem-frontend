import { useCallback, useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { getRecentAlerts } from "../services/threatService";

export function useOverviewData() {
  const [state, setState] = useState({
    loading: true,
    source: "mock",
    kpis: { totalEvents: 0, activeThreats: 0, criticalThreats: 0, fraudCases: 0, usersMonitored: 0, overallRiskScore: 0 },
    trend: [],
    severity: [],
    alerts: [],
    error: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const [dashboard, alerts] = await Promise.all([getDashboardStats(), getRecentAlerts(6)]);
    const source = dashboard.source === "live" && alerts.source === "live" ? "live" : "mock";

    setState({
      loading: false,
      source,
      kpis: dashboard.data.kpis,
      trend: dashboard.data.trend,
      severity: dashboard.data.severity,
      alerts: alerts.data,
      error: dashboard.error || alerts.error || null,
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, retry: load, refetch: load };
}