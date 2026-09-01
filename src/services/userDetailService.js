import api from "./api";
import { getUserBehavior } from "./userService";
import { buildMockDetail } from "../data/mockUserNetwork";

const SEVERITY_ORDER = { low: 0, medium: 1, high: 2, critical: 3 };

export async function getUserDetail(userId) {
  try {
    const [behaviorRes, hybridRes] = await Promise.all([
      getUserBehavior({ user_id: userId, limit: 50 }),
      api.get(`/user-behavior/${encodeURIComponent(userId)}/hybrid-risk`).then((r) => r.data).catch(() => null),
    ]);

    if (behaviorRes.source !== "live" || !behaviorRes.data.items.length) {
      throw new Error("No live behavior events found for this user in the current window.");
    }

    const events = behaviorRes.data.items;
    const emailActivity = events.filter((e) => /email/i.test(e.eventType)).length;
    const loginActivity = events.filter((e) => /login|logout/i.test(e.eventType)).length;
    const fileActivity = events.filter((e) => /file/i.test(e.eventType)).length;

    let maxSeverity = "low";
    events.forEach((e) => { if (SEVERITY_ORDER[e.severity] > SEVERITY_ORDER[maxSeverity]) maxSeverity = e.severity; });
    const riskScore = Math.max(0, ...events.map((e) => e.riskScore || 0));

    return {
      data: {
        userId,
        riskLevel: maxSeverity,
        riskScore,
        totalEvents: events.length,
        emailActivity,
        loginActivity,
        fileActivity,
        lastActivity: events[0]?.timestamp || null,
        // Real fused score from your hybrid-risk endpoint when available --
        // not a client-side estimate.
        aiAnomalyScore: hybridRes?.available ? hybridRes.unified_score : null,
        hybridDetail: hybridRes?.available ? hybridRes : null,
        timeline: events.slice(0, 20).map((e, i) => ({
          id: e.id || `${userId}-${i}`,
          label: e.eventType,
          severity: e.severity,
          timestamp: e.timestamp,
        })),
      },
      source: "live",
      error: null,
    };
  } catch (err) {
    return { data: buildMockDetail(userId), source: "mock", error: err.message };
  }
}