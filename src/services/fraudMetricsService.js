import api from "./api";

// Static, real offline-evaluation results from evaluate_model.py's test
// set (see fraud_threshold.json's test_metrics). NOT invented -- used
// only as a fallback if the backend has no live /fraud/model-metrics
// endpoint yet. Add that route later and this fallback stops being used
// automatically, no frontend change required.
const STATIC_OFFLINE_METRICS = {
  precision: 0.5373134328358209,
  recall: 0.4864864864864865,
  f1: 0.5106382978723404,
  auprc: 0.4979299513694793,
};

export async function getFraudModelMetrics() {
  try {
    const res = await api.get("/fraud/model-metrics");
    return { data: res.data, source: "live", error: null };
  } catch (err) {
    return { data: STATIC_OFFLINE_METRICS, source: "static-offline", error: err.message };
  }
}