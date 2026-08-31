// [MOCK FALLBACK] — shape matches GET /fraud
export const mockFraudRaw = {
  results: [
    { _id: "f1", timestamp: "2026-08-30T13:02:00Z", user_id: "cust_9004", ip: "192.0.2.15", amount: 4820.5, risk_score: 91, reason: ["Autoencoder reconstruction error above threshold"] },
    { _id: "f2", timestamp: "2026-08-30T12:41:00Z", user_id: "cust_9011", ip: "192.0.2.42", amount: 1275.0, risk_score: 64, reason: ["V14 (38.2% contribution)"] },
  ],
  count: 12,
  total_flagged_amount: 38210.75,
};