import { useCallback, useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import { getFraudDetections } from "../services/fraudService";
import { getThreats } from "../services/threatService";
import { getAiModelOverview } from "../services/aiModelsService";
import { estimateConfidence } from "../data/threatInvestigationMock";

function extractItems(res) {
  return res?.data?.items || res?.data?.results || res?.items || res?.results || (Array.isArray(res?.data) ? res.data : []) || [];
}

function buildConfidenceHistogram(items) {
  const bins = Array.from({ length: 10 }, (_, i) => ({ range: `${i * 10}-${i * 10 + 9}`, count: 0 }));
  items.forEach((i) => {
    const c = estimateConfidence(i.riskScore);
    if (c == null) return;
    const idx = Math.min(9, Math.floor(c / 10));
    bins[idx].count += 1;
  });
  return bins;
}

export function useAiInsights() {
  const [state, setState] = useState({
    loading: true,
    source: "mock",
    models: [],
    stats: { totalPredictions: 0, anomaliesDetected: 0, highRiskPredictions: 0, avgConfidence: 0 },
    confidenceHistogram: [],
    trend: [],
    explainableItems: [],
    error: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));

    const [dashboard, fraud, threats, models] = await Promise.all([
      getDashboardStats(),
      getFraudDetections({ limit: 50 }),
      getThreats({ limit: 50, group_incidents: true }),
      getAiModelOverview(),
    ]);

    const fraudItems = extractItems(fraud);
    const threatItems = extractItems(threats);
    const combined = [...fraudItems, ...threatItems];

    const highRisk = combined.filter((i) => (i.riskScore ?? 0) >= 70).length;
    const confidences = combined.map((i) => estimateConfidence(i.riskScore)).filter((v) => v != null);
    const avgConfidence = confidences.length ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0;

    // Explainable items: only ones with real reason[] or real topFeatures --
    // items with neither are excluded rather than given an empty
    // fabricated explanation.
    const explainableItems = combined
      .filter((i) => (i.reason && i.reason.length) || (i.topFeatures && i.topFeatures.length))
      .slice(0, 15)
      .map((i) => ({
        id: i.id,
        label: i.userId ? `${i.type || "transaction"} · ${i.userId}` : `${i.type || "event"} · ${i.ip || "—"}`,
        riskScore: i.riskScore,
        reason: i.reason || [],
        topFeatures: i.topFeatures || [],
        reconstructionError: i.reconstructionError ?? i.reconstruction_error ?? null,
        raw: i,
      }));

    const source = dashboard.source === "live" && fraud.source === "live" && threats.source === "live" ? "live" : "mock";

    setState({
      loading: false,
      source,
      models: models.data,
      stats: {
        totalPredictions: dashboard.data.kpis.totalEvents,
        anomaliesDetected: dashboard.data.kpis.activeThreats + fraudItems.length,
        highRiskPredictions: highRisk,
        avgConfidence,
      },
      confidenceHistogram: buildConfidenceHistogram(combined),
      trend: dashboard.data.trend,
      explainableItems,
      error: dashboard.error || fraud.error || threats.error || null,
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  return { ...state, retry: load };
}