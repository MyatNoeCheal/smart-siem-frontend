export function transformLogs(raw) {
  const results = raw?.results || [];
  return {
    items: results.map((r, i) => ({
      id: r._id || `log-${i}`,
      timestamp: r.timestamp || null,
      ip: r.ip || "—",
      eventType: r.event_type || "—",
      severity: (r.severity || "low").toLowerCase(),
    })),
    total: raw?.total ?? results.length,
    page: raw?.page ?? 1,
    totalPages: raw?.total_pages ?? 1,
  };
}