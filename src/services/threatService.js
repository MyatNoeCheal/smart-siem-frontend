import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformThreats, transformAlerts } from "./transformers/threatTransformer";
import { mockThreatsRaw } from "./mock/mockThreats";

export async function getThreats(params = {}) {
  const { raw, source, error } = await withMockFallback(
    () => api.get("/threats", { params }).then((r) => r.data),
    mockThreatsRaw,
    "getThreats"
  );
  return { data: transformThreats(raw), source, error };
}

export async function getRecentAlerts(limit = 6) {
  const { raw, source, error } = await withMockFallback(
    () =>
      api
        .get("/threats", { params: { limit, group_incidents: true, status: "open", sort: "priority" } })
        .then((r) => r.data),
    mockThreatsRaw,
    "getRecentAlerts"
  );
  return { data: transformAlerts(raw), source, error };
}