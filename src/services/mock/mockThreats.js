// [MOCK FALLBACK] — shape matches GET /threats
export const mockThreatsRaw = {
  results: [
    { _id: "t1", event_type: "brute_force_login", ip: "203.0.113.44", risk_level: "critical", risk_score: 96, priority_score: 132, status: "new", reason: ["12 failed logins in 10 min"], last_seen: "2m ago" },
    { _id: "t2", event_type: "high_value_transaction", ip: "198.51.100.9", risk_level: "high", risk_score: 78, priority_score: 91, status: "investigating", reason: ["High-value transaction ($4,200)"], last_seen: "6m ago" },
    { _id: "t3", event_type: "port_scan", ip: "192.0.2.77", risk_level: "high", risk_score: 71, priority_score: 84, status: "new", reason: ["Sequential port probing"], last_seen: "14m ago" },
    { _id: "t4", event_type: "unusual_login_location", ip: "203.0.113.9", risk_level: "medium", risk_score: 54, priority_score: 48, status: "new", reason: ["Login from new country"], last_seen: "21m ago" },
    { _id: "t5", event_type: "admin_role_change", ip: "10.0.0.14", risk_level: "medium", risk_score: 49, priority_score: 42, status: "new", reason: ["Role escalation outside business hours"], last_seen: "38m ago" },
    { _id: "t6", event_type: "repeated_404_probe", ip: "198.51.100.201", risk_level: "low", risk_score: 22, priority_score: 15, status: "resolved", reason: ["Repeated 404 pattern"], last_seen: "51m ago" },
  ],
  count: 6,
  grouped: true,
};