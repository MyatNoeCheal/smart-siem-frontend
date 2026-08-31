export function transformThreats(raw) {
  const results = raw?.results || [];
  return {
    items: results.map((r, i) => ({
      id: r._id || `threat-${i}`,
      type: (r.event_type || "event").replace(/_/g, " "),
      ip: r.ip || "—",
      severity: (r.risk_level || r.severity || "low").toLowerCase(),
      riskScore: r.risk_score ?? null,
      priorityScore: r.priority_score ?? null,
      status: r.status || null,
      reason: r.reason || [],
      lastSeen: r.last_seen || r.timestamp || null,
      count: r.count || 1,
      mitre: r.mitre || null,
      threatIntel: r.threat_intel || null,
    })),
    count: raw?.count ?? results.length,
    grouped: !!raw?.grouped,
  };
}

// Recent Alerts panel needs a lighter shape derived from the same payload.
export function transformAlerts(raw) {
  return transformThreats(raw).items.map((t) => ({
    id: t.id,
    type: t.type,
    ip: t.ip,
    severity: t.severity,
    time: t.lastSeen || "—",
  }));
}