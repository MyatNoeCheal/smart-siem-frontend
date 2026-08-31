// ============================================================
// MOCK DATA — used only as a fallback when the live FastAPI
// endpoint is unreachable or VITE_FORCE_MOCK=true. Never mix
// this into a live response; consumers should tag data with
// its source ("live" | "mock") instead.
// ============================================================

export const mockKpis = {
  total_events: 128430,
  active_threats: 27,
  critical_threats: 4,
  fraud_cases: 12,
  users_monitored: 3841,
  overall_risk_score: 42,
};

export const mockThreatTrend = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  events: Math.round(120 + Math.sin(i / 3) * 60 + Math.random() * 40),
  anomalies: Math.round(8 + Math.cos(i / 4) * 6 + Math.random() * 6),
}));

export const mockSeverityBreakdown = [
  { name: "Critical", value: 4, color: "#FB4B5D" },
  { name: "High", value: 18, color: "#F5A623" },
  { name: "Medium", value: 46, color: "#F5D547" },
  { name: "Low", value: 132, color: "#33D69F" },
];

export const mockRecentAlerts = [
  { id: "a1", type: "Brute Force Login", ip: "203.0.113.44", severity: "critical", time: "2m ago" },
  { id: "a2", type: "Fraud: High-Value Txn", ip: "198.51.100.9", severity: "high", time: "6m ago" },
  { id: "a3", type: "Port Scan Detected", ip: "192.0.2.77", severity: "high", time: "14m ago" },
  { id: "a4", type: "Unusual Login Location", ip: "203.0.113.9", severity: "medium", time: "21m ago" },
  { id: "a5", type: "Admin Role Change", ip: "10.0.0.14", severity: "medium", time: "38m ago" },
  { id: "a6", type: "Repeated 404 Probing", ip: "198.51.100.201", severity: "low", time: "51m ago" },
];

export const mockThreatNodes = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)],
}));