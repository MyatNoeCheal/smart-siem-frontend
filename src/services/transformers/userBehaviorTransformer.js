export function transformUserBehavior(raw) {
  const results = raw?.results || [];
  return {
    items: results.map((r, i) => ({
      id: r._id || `ub-${i}`,
      timestamp: r.timestamp || null,
      userId: r.user_id || "—",
      ip: r.ip || "—",
      eventType: r.event_type || "—",
      severity: (r.risk_level || r.severity || "low").toLowerCase(),
      riskScore: r.risk_score ?? null,
    })),
  };
}