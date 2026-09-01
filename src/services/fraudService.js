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

  getTransactions: (params = {}) =>
    withFallback(
      () => api.get('/fraud', { params }),
      { results: MOCK_TRANSACTIONS },
      'getTransactions'
    ),

  getTransactionDetail: (id) =>
    withFallback(
      () => api.get(`/fraud/${id}`),
      { ...MOCK_TRANSACTIONS.find((t) => t.id === id), top_features: [
        { feature: 'V14', contribution_pct: 32.1 },
        { feature: 'Amount', contribution_pct: 21.4 },
        { feature: 'V4', contribution_pct: 15.7 },
      ]},
      'getTransactionDetail'
    ),

  // Only returns something if your backend actually exposes evaluation
  // metrics (e.g. from evaluate_model.py's metrics_summary.json served
  // via an endpoint). Returns null on failure — UI must not invent numbers.
  getModelMetrics: async () => {
    try {
      const { data } = await api.get('/fraud/model-metrics');
      return { data, isMock: false };
    } catch {
      return { data: null, isMock: false };
    }
  },
};

// ── Named export for modules (e.g. analyticsService.js) that expect a
// standalone function rather than the fraudService object. Returns the
// plain array of transactions — callers don't need to unwrap { data, isMock }.
export async function getFraudDetections(params = {}) {
  const { data } = await fraudService.getTransactions(params);
  return data.results || [];
}