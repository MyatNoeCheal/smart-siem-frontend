// [MOCK FALLBACK] — shape matches GET /overview and GET /overview/timeline
export const mockOverviewRaw = {
  total_events: 128430,
  critical_events: 4,
  anomalies: 312,
  users_monitored: 3841,
  overall_risk_score: 42,
  events_by_category: { threat: 27, fraud: 12, user_behavior: 640, admin_activity: 58 },
};

export const mockTimelineRaw = {
  labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
  total: Array.from({ length: 24 }, (_, i) => Math.round(120 + Math.sin(i / 3) * 60 + Math.random() * 40)),
  anomalies: Array.from({ length: 24 }, (_, i) => Math.round(8 + Math.cos(i / 4) * 6 + Math.random() * 6)),
};