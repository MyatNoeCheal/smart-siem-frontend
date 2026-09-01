import { getThreats } from "./threatService";
import { getFraudDetections } from "./fraudService";
import { getUserBehavior } from "./userService";

// Tolerates a few possible response shapes so a divergence in any one
// service's return value can't crash the whole analytics layer -- always
// resolves to a plain array, never throws.
function extractItems(res) {
  return res?.data?.items || res?.data?.results || res?.items || res?.results || (Array.isArray(res?.data) ? res.data : []) || [];
}

export async function getThreatTypeBreakdown(limit = 100) {
  const res = await getThreats({ limit, group_incidents: true });
  const items = extractItems(res);
  const counts = {};
  items.forEach((t) => {
    const type = t.type || "unknown";
    counts[type] = (counts[type] || 0) + (t.count || 1);
  });
  const breakdown = Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  return { data: breakdown, source: res.source, error: res.error };
}

export async function getAiConfidence() {
  const [fraudRes, behaviorRes] = await Promise.all([
    getFraudDetections({ limit: 50 }),
    getUserBehavior({ limit: 50 }),
  ]);

  const fraudItems = extractItems(fraudRes);
  const behaviorItems = extractItems(behaviorRes);

  const avg = (items, key) => {
    const scores = items.map((i) => i[key]).filter((v) => typeof v === "number");
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const fraudScore = avg(fraudItems, "riskScore");
  const behaviorScore = avg(behaviorItems, "riskScore");
  const combined =
    fraudScore != null && behaviorScore != null
      ? Math.round((fraudScore + behaviorScore) / 2)
      : fraudScore ?? behaviorScore;

  const source = fraudRes.source === "live" && behaviorRes.source === "live" ? "live" : "mock";

  return {
    data: {
      fraud: fraudScore,
      behavioral: behaviorScore,
      combined,
      sampleSizes: { fraud: fraudItems.length, behavioral: behaviorItems.length },
    },
    source,
    error: fraudRes.error || behaviorRes.error || null,
  };
}