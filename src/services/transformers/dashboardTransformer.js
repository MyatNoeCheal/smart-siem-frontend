export function transformDashboard(overviewRaw, timelineRaw) {
  const cats = overviewRaw?.events_by_category || {};
  return {
    kpis: {
      totalEvents: overviewRaw?.total_events ?? 0,
      activeThreats: cats.threat ?? 0,
      criticalThreats: overviewRaw?.critical_events ?? 0,
      fraudCases: cats.fraud ?? 0,
      usersMonitored: overviewRaw?.users_monitored ?? 0,
      overallRiskScore: overviewRaw?.overall_risk_score ?? 0,
    },
    severity: [
      { name: "Critical", value: overviewRaw?.critical_events ?? 0, color: "#FB4B5D" },
      { name: "High", value: cats.threat ?? 0, color: "#F5A623" },
      { name: "Medium", value: cats.user_behavior ?? 0, color: "#F5D547" },
      { name: "Low", value: cats.admin_activity ?? 0, color: "#33D69F" },
    ],
    trend: (timelineRaw?.labels || []).map((label, i) => ({
      hour: label,
      events: timelineRaw?.total?.[i] ?? 0,
      anomalies: timelineRaw?.anomalies?.[i] ?? 0,
    })),
  };
}