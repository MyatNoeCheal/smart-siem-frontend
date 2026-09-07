export function transformLogs(raw) {
  const results = raw?.results || [];
  return {
    items: results.map((r, i) => ({
      id: r._id || `log-${i}`,
      timestamp: r.timestamp || null,
      userId: r.user_id || null,
      ip: r.ip || "—",
      destination: r.destination || r.dest_ip || null,
      eventType: r.event_type || "—",
      severity: (r.severity || "low").toLowerCase(),
      riskScore: r.risk_score ?? null,
      anomaly: !!r.anomaly,
      category: r.category || null,
      raw: r, // full original document, for the expanded JSON view
    })),
    total: raw?.total ?? results.length,
    page: raw?.page ?? 1,
    totalPages: raw?.total_pages ?? 1,
  };
}