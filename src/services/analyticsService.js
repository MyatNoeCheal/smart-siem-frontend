import { getThreats } from "./threatService";
import { getFraudDetections } from "./fraudService";
import { getUserBehavior } from "./userService";

// Threat type distribution is DERIVED client-side from the same /threats
// response threatService already fetches (with its own mock fallback) --
// no separate backend endpoint needed, and no data is invented here: if
// /threats is mock, this breakdown is mock too, tagged the same way.
export async function getThreatTypeBreakdown(limit = 100) {
  const { data, source, error } = await getThreats({ limit, group_incidents: true });
  const counts = {};
  data.items.forEach((t) => {
    counts[t.type] = (counts[t.type] || 0) + (t.count || 1);
  });
  const items = Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  return { data: items, source, error };
}

// AI "confidence" here is an honest average risk score over recently
// scored events per model -- same approach the original dashboard.js
// gauges used -- not a fabricated confidence metric.
export async function getAiConfidence() {
  const [fraud, behavior] = await Promise.all([
    getFraudDetections({ limit: 50 }),
    getUserBehavior({ limit: 50 }),
  ]);

  const avg = (items, key) => {
    const scores = items.map((i) => i[key]).filter((v) => typeof v === "number");
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const fraudScore = avg(fraud.data.items, "riskScore");
  const behaviorScore = avg(behavior.data.items, "riskScore");
  const combined =
    fraudScore != null && behaviorScore != null
      ? Math.round((fraudScore + behaviorScore) / 2)
      : fraudScore ?? behaviorScore;

  const source = fraud.source === "live" && behavior.source === "live" ? "live" : "mock";

  return {
    data: {
      fraud: fraudScore,
      behavioral: behaviorScore,
      combined,
      sampleSizes: { fraud: fraud.data.items.length, behavioral: behavior.data.items.length },
    },
    source,
    error: fraud.error || behavior.error || null,
  };
}