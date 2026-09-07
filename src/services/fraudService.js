import api from './api';

const USE_MOCK_FALLBACK = true; // flips to false once your endpoints are stable

// ── Mock data, clearly labeled — only used if the API call fails ──
const MOCK_FRAUD_STATS = {
  _mock: true,
  total_transactions: 18420,
  fraud_detected: 312,
  fraud_rate: 1.69,
  avg_risk_score: 34.2,
  high_risk_count: 87,
};

const MOCK_FRAUD_TREND = Array.from({ length: 14 }, (_, i) => ({
  _mock: true,
  date: `Day ${i + 1}`,
  fraud_count: Math.round(10 + Math.random() * 30),
  total_count: Math.round(800 + Math.random() * 400),
}));

const MOCK_SEVERITY_DIST = [
  { name: 'Low', value: 210 },
  { name: 'Medium', value: 68 },
  { name: 'High', value: 26 },
  { name: 'Critical', value: 8 },
];

const MOCK_TRANSACTIONS = Array.from({ length: 12 }, (_, i) => ({
  _mock: true,
  id: `TXN-${9000 + i}`,
  user: `cust_${9000 + i}`,
  amount: Math.round(50 + Math.random() * 2000),
  timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
  risk_score: Math.round(Math.random() * 100),
  classification: Math.random() > 0.7 ? 'Fraud' : 'Normal',
  status: ['new', 'investigating', 'resolved'][Math.floor(Math.random() * 3)],
  reason: ['High-value transaction', 'Unusual location', 'Velocity anomaly'][Math.floor(Math.random() * 3)],
}));

// ── Normalizes a raw backend /fraud document into the shape this page's
// UI expects (id, user, risk_score, classification, status). Backend
// documents use Mongo's _id/user_id naming; without this step, every
// live row silently had `id === undefined`, which broke both the table's
// React keys AND any "click a row -> fetch /fraud/{id}" call downstream.
// Mock data already matches the expected shape, so it passes through
// unchanged. ──
function normalizeTransaction(raw) {
  if (!raw) return raw;
  if (raw._mock || raw.id) return raw; // already normalized or mock
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

async function withFallback(requestFn, mockValue, label) {
  try {
    const { data } = await requestFn();
    return { data, isMock: false };
  } catch (err) {
    if (!USE_MOCK_FALLBACK) throw err;
    console.warn(`[fraudService] ${label} unavailable, using mock data`, err?.message);
    return { data: mockValue, isMock: true };
  }
}

export const fraudService = {
  getStats: () =>
    withFallback(() => api.get('/fraud/stats'), MOCK_FRAUD_STATS, 'getStats'),

  getTrend: (days = 14) =>
    withFallback(() => api.get(`/fraud/trend?days=${days}`), MOCK_FRAUD_TREND, 'getTrend'),

  getSeverityDistribution: () =>
    withFallback(() => api.get('/fraud/severity-distribution'), MOCK_SEVERITY_DIST, 'getSeverityDistribution'),

  getTransactions: async (params = {}) => {
    const result = await withFallback(
      () => api.get('/fraud', { params }),
      { results: MOCK_TRANSACTIONS },
      'getTransactions'
    );
    const results = (result.data.results || []).map(normalizeTransaction);
    return { ...result, data: { ...result.data, results } };
  },

  // `fallbackTxn` is the already-normalized row the user clicked, if you
  // have it -- lets the fallback show real data (amount, user, risk
  // score) for a live transaction instead of an empty mock stand-in when
  // the backend doesn't have a matching per-transaction detail route.
  getTransactionDetail: (id, fallbackTxn = null) =>
    withFallback(
      () => api.get(`/fraud/${id}`),
      {
        ...(fallbackTxn || MOCK_TRANSACTIONS.find((t) => t.id === id) || {
          id, user: '—', amount: null, timestamp: null, risk_score: 0, classification: 'Normal', status: 'new',
        }),
        top_features: fallbackTxn?.top_features?.length ? fallbackTxn.top_features : [
          { feature: 'V14', contribution_pct: 32.1 },
          { feature: 'Amount', contribution_pct: 21.4 },
          { feature: 'V4', contribution_pct: 15.7 },
        ],
      },
      'getTransactionDetail'
    ),

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