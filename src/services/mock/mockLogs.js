// [MOCK FALLBACK] — shape matches GET /logs
const EVENT_TYPES = ["login", "browse", "checkout", "failed_login", "config_change", "port_scan", "add_to_cart"];

export const mockLogsRaw = {
  results: Array.from({ length: 25 }, (_, i) => {
    const anomaly = i % 6 === 0;
    return {
      _id: `log-${1000 + i}`,
      timestamp: new Date(Date.now() - i * 4 * 60000).toISOString(),
      ip: `198.51.100.${10 + (i % 40)}`,
      user_id: i % 3 === 0 ? null : `cust_${9000 + (i % 12)}`,
      event_type: EVENT_TYPES[i % EVENT_TYPES.length],
      severity: ["low", "low", "medium", "high", "critical"][i % 5],
      risk_score: anomaly ? 60 + (i % 35) : 5 + (i % 20),
      anomaly,
      category: EVENT_TYPES[i % EVENT_TYPES.length] === "config_change" ? "admin_activity" : "threat",
    };
  }),
  total: 4820,
  page: 1,
  total_pages: 193,
};