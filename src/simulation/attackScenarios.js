// ============================================================
// ATTACK SCENARIO — pure data, no timers or React here. This is
// the shape a real backend event stream should eventually match:
// a list of timestamped stages, each optionally updating nodes
// or declaring the path/detection. Swapping the *source* that
// plays this back (see AttackSimulationSource.js) is the only
// thing that needs to change to go from "scripted demo" to
// "live FastAPI/WebSocket feed".
// ============================================================

export const LOGIN_TO_DB_ATTACK = {
  id: "login-to-db-breach",

  // Maps to real node/edge ids in threatNetworkMock.js — a compromised
  // checkout session escalating from a normal login into a database hit.
  path: {
    nodeIds: ["srv-web1", "usr-2", "app-checkout", "db-orders"],
    edgeIds: ["edge-5", "edge-11", "edge-16"],
  },

  threat: {
    type: "Credential Abuse → Lateral Movement → Data Access",
    user: "customer_5583",
    aiModel: "Hybrid Fusion (Rule Engine + LSTM Behavioral Autoencoder)",
    finalRiskScore: 95,
    confidence: 0.94,
  },

  stages: [
    {
      atMs: 0,
      key: "normal",
      label: "Stage 1 — Normal activity",
      detail: "Session customer_5583 authenticated. Baseline behavior nominal.",
    },
    {
      atMs: 1300,
      key: "suspicious_user",
      label: "Stage 2 — User flagged suspicious",
      detail: "Login velocity and session pattern deviating from baseline.",
      nodeUpdates: [{ nodeId: "usr-2", threatLevel: "suspicious", riskScore: 46 }],
    },
    {
      atMs: 2800,
      key: "ai_analyzing",
      label: "Stage 3 — AI analyzing behavior",
      detail: "Hybrid model scoring the 15-event sequence against learned baseline…",
    },
    {
      atMs: 4200,
      key: "risk_rising",
      label: "Stage 4 — Risk score increasing",
      detail: "Reconstruction error rising across consecutive events.",
      nodeUpdates: [{ nodeId: "usr-2", threatLevel: "suspicious", riskScore: 71 }],
    },
    {
      atMs: 5500,
      key: "path_highlighted",
      label: "Stage 5 — Attack path identified",
      detail: "Correlated path: Web Server → User → Checkout Service → Orders DB",
      highlightPath: true,
    },
    {
      atMs: 6900,
      key: "db_critical",
      label: "Stage 6 — Database targeted",
      detail: "Anomalous query volume against Orders DB from this session.",
      nodeUpdates: [
        { nodeId: "usr-2", threatLevel: "critical", riskScore: 92 },
        { nodeId: "app-checkout", threatLevel: "suspicious", riskScore: 58 },
        { nodeId: "db-orders", threatLevel: "critical", riskScore: 95 },
      ],
    },
    {
      atMs: 8200,
      key: "detected",
      label: "Stage 7 — Critical threat detected",
      detail: "Hybrid risk fusion confirms an active breach in progress.",
      detected: true,
    },
  ],
};