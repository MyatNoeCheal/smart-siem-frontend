import { useCallback, useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { getFraudDetections } from "../services/fraudService";
import { getFraudModelMetrics } from "../services/fraudMetricsService";
import { buildFraudTrend, buildRiskHistogram, buildSeverityBreakdown, HIGH_RISK_THRESHOLD } from "../services/fraudAnalyticsService";

export function useFraudDetection() {
  const [state, setState] = useState({
    loading: true,
    source: "mock",
    stats: { totalAnalyzed: 0, detected: 0, fraudRate: 0, avgRisk: 0, highRisk: 0 },
    trend: [],
    severity: [],
    histogram: [],
    transactions: [],
    metrics: null,
    metricsSource: "static-offline",
    error: null,
  });

  // Session-only investigation status per transaction -- not persisted,
  // same pattern as the Threat Investigation page's local-only actions.
  const [statusOverrides, setStatusOverrides] = useState({});

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    const [dashboard, fraud, metrics] = await Promise.all([
      getDashboardStats(),
      getFraudDetections({ limit: 200 }),
      getFraudModelMetrics(),
    ]);

    const items = fraud.data.items;
    const totalAnalyzed = dashboard.data.kpis.fraudCases || items.length;
    const detected = items.length;
    const fraudRate = totalAnalyzed ? Math.round((detected / totalAnalyzed) * 1000) / 10 : 0;
    const scores = items.map((i) => i.riskScore).filter((v) => typeof v === "number");
    const avgRisk = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highRisk = items.filter((i) => (i.riskScore ?? 0) >= HIGH_RISK_THRESHOLD).length;
    const source = dashboard.source === "live" && fraud.source === "live" ? "live" : "mock";

    setState({
      loading: false,
      source,
      stats: { totalAnalyzed, detected, fraudRate, avgRisk, highRisk },
      trend: buildFraudTrend(items),
      severity: buildSeverityBreakdown(items),
      histogram: buildRiskHistogram(items),
      transactions: items,
      metrics: metrics.data,
      metricsSource: metrics.source,
      error: dashboard.error || fraud.error || null,
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  const setTransactionStatus = useCallback((id, status) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));
  }, []);
  const getTransactionStatus = useCallback((id) => statusOverrides[id] || "unreviewed", [statusOverrides]);

  return { ...state, retry: load, setTransactionStatus, getTransactionStatus };
}