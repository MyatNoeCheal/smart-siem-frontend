// [MOCK FALLBACK] — shape matches GET /ai-insights
export const mockAiInsightsRaw = {
  summary: "Analyzed the 250 most recent security events. No Critical events, but 4 High-severity events were logged. Most activity falls under 'user behavior' (640 of 737 events). Overall anomaly rate is 5.4% (40 of 737 events flagged).",
  top_risks: [
    "4 High-severity event(s) logged, most commonly 'port_scan' (2 occurrences).",
    "IP 203.0.113.44 generated 5 events in this window — worth checking for repeated failed logins.",
  ],
  generated_at: new Date().toISOString(),
};