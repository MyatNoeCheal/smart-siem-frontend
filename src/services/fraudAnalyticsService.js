export const HIGH_RISK_THRESHOLD = 70;

function riskLevel(score) {
  if (score == null) return "low";
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function buildSeverityBreakdown(items) {
  const buckets = { critical: 0, high: 0, medium: 0, low: 0 };
  items.forEach((i) => { buckets[riskLevel(i.riskScore)] += 1; });
  return [
    { name: "Critical", value: buckets.critical, color: "#FB4B5D" },
    { name: "High", value: buckets.high, color: "#F5A623" },
    { name: "Medium", value: buckets.medium, color: "#F5D547" },
    { name: "Low", value: buckets.low, color: "#33D69F" },
  ];
}

export function buildRiskHistogram(items) {
  const bins = Array.from({ length: 10 }, (_, i) => ({ range: `${i * 10}-${i * 10 + 9}`, count: 0 }));
  items.forEach((i) => {
    if (typeof i.riskScore !== "number") return;
    const idx = Math.min(9, Math.floor(i.riskScore / 10));
    bins[idx].count += 1;
  });
  return bins;
}

// Buckets flagged transactions by calendar day, taken from their own
// timestamps -- robust for both live data and fixed-timestamp mock data,
// since it never assumes "today" is inside the data's date range.
export function buildFraudTrend(items) {
  const withDates = items.filter((i) => i.timestamp);
  if (!withDates.length) return [];

  const dayKey = (ts) => new Date(ts).toISOString().slice(0, 10);
  const grouped = {};
  withDates.forEach((i) => {
    const key = dayKey(i.timestamp);
    if (!grouped[key]) grouped[key] = { day: key, count: 0, riskSum: 0 };
    grouped[key].count += 1;
    grouped[key].riskSum += i.riskScore || 0;
  });

  return Object.values(grouped)
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(-14)
    .map((g) => ({ day: g.day.slice(5), count: g.count, avgRisk: Math.round(g.riskSum / g.count) }));
}