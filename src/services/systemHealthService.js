import api from "./api";

// Only /health is a real backend signal here -- everything else in the
// returned object is explicitly labeled as INFERRED from that single
// reachability check, not a genuine per-subsystem status report (your
// main.py's /health returns just a message, nothing per-component).
export async function getSystemHealth() {
  const startedAt = performance.now();
  try {
    await api.get("/health");
    const latencyMs = Math.round(performance.now() - startedAt);
    return {
      data: { apiOnline: true, latencyMs, databaseInferred: true, aiModelsInferred: true },
      source: "live",
      error: null,
    };
  } catch (err) {
    return {
      data: { apiOnline: false, latencyMs: null, databaseInferred: false, aiModelsInferred: false },
      source: "mock",
      error: err.message,
    };
  }
}