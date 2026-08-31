import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformDashboard } from "./transformers/dashboardTransformer";
import { mockOverviewRaw, mockTimelineRaw } from "./mock/mockDashboard";

export async function getDashboardStats({ hours = 24, buckets = 24 } = {}) {
  const overview = await withMockFallback(
    () => api.get("/overview").then((r) => r.data),
    mockOverviewRaw,
    "getDashboardStats:overview"
  );
  const timeline = await withMockFallback(
    () => api.get("/overview/timeline", { params: { hours, buckets } }).then((r) => r.data),
    mockTimelineRaw,
    "getDashboardStats:timeline"
  );

  // A dashboard mixing one live number with one mock number is worse
  // than either being consistently one or the other -- if either call
  // fell back, treat the whole combined result as mock.
  const source = overview.source === "live" && timeline.source === "live" ? "live" : "mock";

  return {
    data: transformDashboard(overview.raw, timeline.raw),
    source,
    error: overview.error || timeline.error || null,
  };
}