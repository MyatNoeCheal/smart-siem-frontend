export function transformAdminActivity(raw) {
  const results = raw?.results || [];
  return {
    items: results.map((r, i) => ({
      id: r._id || `admin-${i}`,
      timestamp: r.timestamp || null,
      userId: r.user_id || "—",
      ip: r.ip || "—",
      eventType: r.event_type || "—",
      severity: (r.risk_level || r.severity || "low").toLowerCase(),
      mitre: r.mitre || null,
      threatIntel: r.threat_intel || null,
      raw: r,
    })),
  };
}