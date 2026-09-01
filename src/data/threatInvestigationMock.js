// ============================================================
// Fields /threats genuinely does NOT return (confidence, detection
// model, first-seen) are derived/estimated HERE ONLY -- kept out of
// components so no component silently invents a number. Everything
// here is honestly labeled "estimated" in the UI that displays it.
// ============================================================

export const DETECTION_MODEL_LABEL = "Hybrid Fusion (Rule Engine + LSTM Behavioral Autoencoder)";

// Risk score -> a plausible confidence band. Not a real model output --
// /threats has no confidence field -- just a readable proxy so the page
// isn't missing the requested field entirely.
export function estimateConfidence(riskScore) {
  if (riskScore == null) return null;
  return Math.min(99, Math.max(55, Math.round(riskScore * 0.9 + 12)));
}

// Kill-chain depth an attack of this severity is assumed to have reached,
// purely for driving the AttackPathScene visualization -- not a claim
// about what actually happened on the real network.
export function severityToChainDepth(severity) {
  switch (severity) {
    case "critical": return 5; // reaches Database
    case "high": return 4;     // reaches Server
    case "medium": return 3;   // reaches Application
    default: return 2;         // reaches Email
  }
}

// Fallback timeline used ONLY if no real /logs entries are found for
// this threat's IP -- keeps the page useful even for a purely mock
// threat, clearly distinct from the real-log path in useThreatInvestigation.
export function buildFallbackTimeline(threat) {
  const base = threat.lastSeen ? new Date(threat.lastSeen) : new Date();
  const steps = [
    "Session authenticated",
    "Unusual activity pattern observed",
    "Anomaly flagged by detection engine",
    "Risk score escalated",
    `Classified as ${threat.type}`,
  ];
  return steps.map((label, i) => ({
    id: `fallback-${i}`,
    label,
    timestamp: new Date(base.getTime() - (steps.length - 1 - i) * 60000).toISOString(),
  }));
}