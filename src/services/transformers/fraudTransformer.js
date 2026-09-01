export function transformFraud(raw) {
  const results = raw?.results || [];
  return {
    items: results.map((r, i) => ({
      id: r._id || `fraud-${i}`,
      timestamp: r.timestamp || null,
      userId: r.user_id || "—",
      ip: r.ip || "—",
      amount: r.amount ?? null,
      riskScore: r.risk_score ?? null,
      reason: r.reason || [],
      topFeatures: r.top_features || [],
    })),
    count: raw?.count ?? results.length,
    totalFlaggedAmount: raw?.total_flagged_amount ?? 0,
  };
}