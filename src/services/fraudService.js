import api from './api';

// ── Normalizes a raw backend /fraud document into the shape this page's
// UI expects (id, user, risk_score, classification, status). Backend
// documents use Mongo's _id/user_id naming; without this step, every
// live row silently had `id === undefined`, which broke both the table's
// React keys AND any "click a row -> fetch /fraud/{id}" call downstream.
// ──
function normalizeTransaction(raw) {
  if (!raw) return raw;
  if (raw.id) return raw;
  const riskScore = raw.risk_score ?? 0;
  return {
    id: raw._id,
    user: raw.user_id || '—',
    amount: raw.amount ?? null,
    timestamp: raw.timestamp || null,
    risk_score: riskScore,
    // Backend doesn't return a classification label -- derived here from
    // the same risk_score the detection engine already computed, not a
    // separately invented judgment.
    classification: riskScore >= 60 ? 'Fraud' : 'Normal',
    // Backend /fraud has no per-transaction workflow status field --
    // defaults to 'new' until the analyst reviews it in-session.
    status: 'new',
    reason: Array.isArray(raw.reason) ? raw.reason.join(', ') : (raw.reason || ''),
    top_features: raw.top_features || [],
    _raw: raw,
  };
}

export const fraudService = {
  getStats: async () => {
    const { data } = await api.get('/fraud/stats');
    return { data, isMock: false };
  },

  getTrend: async (days = 14) => {
    const { data } = await api.get(`/fraud/trend?days=${days}`);
    return { data, isMock: false };
  },

  getSeverityDistribution: async () => {
    const { data } = await api.get('/fraud/severity-distribution');
    return { data, isMock: false };
  },

  getTransactions: async (params = {}) => {
    const { data } = await api.get('/fraud', { params });
    const results = (data.results || []).map(normalizeTransaction);
    return { data: { ...data, results }, isMock: false };
  },

  getTransactionDetail: async (id) => {
    const { data } = await api.get(`/fraud/${id}`);
    return { data: normalizeTransaction(data), isMock: false };
  },

  // Only returns something if your backend actually exposes evaluation
  // metrics. Returns null on failure — UI must not invent numbers.
  getModelMetrics: async () => {
    try {
      const { data } = await api.get('/fraud/model-metrics');
      return { data, isMock: false };
    } catch {
      return { data: null, isMock: false };
    }
  },
};

export async function getFraudDetections(params = {}) {
  const { data } = await fraudService.getTransactions(params);
  return data.results || [];
}