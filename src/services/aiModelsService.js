import api from "./api";
import { getFraudDetections } from "./fraudService";
import { getUserBehavior } from "./userService";
import { getFraudModelMetrics } from "./fraudMetricsService";

function extractItems(res) {
  return res?.data?.items || res?.data?.results || res?.items || res?.results || (Array.isArray(res?.data) ? res.data : []) || [];
}

// Real, unlabeled rationale from this project's own evaluate_lstm_model.py --
// not invented. email.csv has no ground-truth insider-threat labels, so
// Precision/Recall/F1/AUPRC genuinely cannot be computed for this model.
const LSTM_UNSUPERVISED_NOTE =
  "Unsupervised model — email.csv has no ground-truth insider-threat labels, " +
  "so Precision/Recall/F1/AUPRC aren't computable here. Evaluated instead via " +
  "reconstruction-error distribution and qualitative review of top anomalies.";

export async function getAiModelOverview() {
  const [fraudRes, behaviorRes, fraudMetrics] = await Promise.all([
    getFraudDetections({ limit: 50 }),
    getUserBehavior({ limit: 50 }),
    getFraudModelMetrics(),
  ]);

  const fraudItems = extractItems(fraudRes);
  const behaviorItems = extractItems(behaviorRes);

  // LSTM status is verified with a real call, not assumed from the
  // presence of /user-behavior data alone.
  let lstmStatus = "not confirmed";
  let lstmNote = "No live user-behavior data available this session to verify.";
  if (behaviorRes.source === "live" && behaviorItems.length) {
    const sampleUserId = behaviorItems[0].userId;
    try {
      const res = await api.get(`/user-behavior/${encodeURIComponent(sampleUserId)}/hybrid-risk`);
      const lstmComponent = res.data?.components?.lstm_behavioral;
      if (res.data?.available && lstmComponent?.available) {
        lstmStatus = "active";
        lstmNote = `Confirmed — sequence scoring succeeded for a sampled user (${sampleUserId}).`;
      } else {
        lstmNote = lstmComponent?.reason || "Not enough sequence history yet for the sampled user.";
      }
    } catch {
      lstmNote = "Could not reach the hybrid-risk endpoint to confirm this session.";
    }
  }

  const fraudActive = fraudRes.source === "live" && fraudItems.length > 0;

  const models = [
    {
      id: "fraud-autoencoder",
      name: "Fraud Autoencoder",
      type: "Unsupervised · scikit-learn MLPRegressor",
      status: fraudActive ? "active" : "not confirmed",
      note: fraudActive
        ? `Confirmed — ${fraudItems.length} live-scored transaction(s) seen this session.`
        : "No live-scored fraud transactions seen this session.",
      description: "Flags anomalous transactions via reconstruction error on Time + V1–V28 (PCA-anonymized) + Amount.",
      metrics: fraudMetrics.data,
      metricsSource: fraudMetrics.source,
    },
    {
      id: "lstm-autoencoder",
      name: "LSTM Behavioral Autoencoder",
      type: "Unsupervised · PyTorch, 15-event sequence windows",
      status: lstmStatus,
      note: lstmNote,
      description: "Scores a user's recent 15-event sequence against learned baseline behavior; feeds Hybrid Fusion.",
      metrics: null,
      metricsSource: "unsupervised",
      unsupervisedNote: LSTM_UNSUPERVISED_NOTE,
    },
  ];

  return { data: models, source: fraudActive || lstmStatus === "active" ? "live" : "mock" };
}