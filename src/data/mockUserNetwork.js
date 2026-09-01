// ============================================================
// MOCK DATA — a richer demo graph showing all five requested
// relationship types (email/login/file/application/server), since
// the live graph can only honestly infer "shared IP" edges (see
// userNetworkService.js). Clearly tagged MOCK wherever shown.
// ============================================================

export const mockUsers = [
  { id: "admin_jkim", riskLevel: "critical", eventCount: 214 },
  { id: "cust_5583", riskLevel: "high", eventCount: 132 },
  { id: "cust_3399", riskLevel: "high", eventCount: 98 },
  { id: "cust_9011", riskLevel: "medium", eventCount: 64 },
  { id: "cust_7710", riskLevel: "medium", eventCount: 58 },
  { id: "cust_2291", riskLevel: "low", eventCount: 41 },
  { id: "cust_1042", riskLevel: "low", eventCount: 37 },
  { id: "cust_6650", riskLevel: "low", eventCount: 29 },
  { id: "cust_4408", riskLevel: "medium", eventCount: 52 },
  { id: "admin_rpatel", riskLevel: "high", eventCount: 87 },
  { id: "cust_8823", riskLevel: "low", eventCount: 22 },
  { id: "cust_3117", riskLevel: "critical", eventCount: 176 },
  { id: "cust_5901", riskLevel: "low", eventCount: 19 },
  { id: "cust_2265", riskLevel: "medium", eventCount: 46 },
  { id: "cust_9944", riskLevel: "low", eventCount: 15 },
  { id: "cust_7382", riskLevel: "high", eventCount: 71 },
];

export const mockEdges = [
  { id: "e1", source: "admin_jkim", target: "cust_3117", type: "file_access" },
  { id: "e2", source: "admin_jkim", target: "admin_rpatel", type: "email" },
  { id: "e3", source: "admin_jkim", target: "cust_5583", type: "server" },
  { id: "e4", source: "cust_5583", target: "cust_3399", type: "login" },
  { id: "e5", source: "cust_5583", target: "cust_9011", type: "application" },
  { id: "e6", source: "cust_3399", target: "cust_7710", type: "email" },
  { id: "e7", source: "admin_rpatel", target: "cust_4408", type: "file_access" },
  { id: "e8", source: "admin_rpatel", target: "cust_7382", type: "server" },
  { id: "e9", source: "cust_2291", target: "cust_1042", type: "login" },
  { id: "e10", source: "cust_1042", target: "cust_6650", type: "application" },
  { id: "e11", source: "cust_9011", target: "cust_2265", type: "email" },
  { id: "e12", source: "cust_7710", target: "cust_8823", type: "login" },
  { id: "e13", source: "cust_3117", target: "cust_7382", type: "server" },
  { id: "e14", source: "cust_4408", target: "cust_5901", type: "application" },
  { id: "e15", source: "cust_2265", target: "cust_9944", type: "login" },
];

function seededScore(seed, min, max) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 1000;
  return min + Math.round((h / 1000) * (max - min));
}

// Used both for known mock users AND as a generic fallback for any
// userId clicked while the whole network is in mock mode -- so nothing
// ever renders blank, while staying clearly labeled "mock" upstream.
export function buildMockDetail(userId) {
  const known = mockUsers.find((u) => u.id === userId);
  const riskLevel = known?.riskLevel || (seededScore(userId, 0, 3) === 3 ? "critical" : seededScore(userId, 0, 3) === 2 ? "high" : seededScore(userId, 0, 3) === 1 ? "medium" : "low");
  const totalEvents = known?.eventCount || seededScore(userId, 10, 80);
  const riskScore = { low: seededScore(userId, 5, 25), medium: seededScore(userId, 30, 55), high: seededScore(userId, 58, 82), critical: seededScore(userId, 85, 99) }[riskLevel];

  return {
    userId,
    riskLevel,
    riskScore,
    totalEvents,
    emailActivity: seededScore(userId + "e", 0, Math.round(totalEvents * 0.3)),
    loginActivity: seededScore(userId + "l", 3, Math.round(totalEvents * 0.5)),
    fileActivity: seededScore(userId + "f", 0, Math.round(totalEvents * 0.2)),
    lastActivity: new Date(Date.now() - seededScore(userId + "t", 2, 240) * 60000).toISOString(),
    aiAnomalyScore: riskScore,
    hybridDetail: null,
    timeline: ["Login", "Browsed catalog", "Unusual session pattern", "Anomaly flagged", `Classified as ${riskLevel} risk`].map((label, i, arr) => ({
      id: `${userId}-t${i}`,
      label,
      severity: i >= arr.length - 2 ? riskLevel : "low",
      timestamp: new Date(Date.now() - (arr.length - i) * 4 * 60000).toISOString(),
    })),
  };
}