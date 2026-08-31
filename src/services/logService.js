import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformLogs } from "./transformers/logTransformer";
import { mockLogsRaw } from "./mock/mockLogs";

export async function getLogs(params = {}) {
  const { raw, source, error } = await withMockFallback(
    () => api.get("/logs", { params }).then((r) => r.data),
    mockLogsRaw,
    "getLogs"
  );
  return { data: transformLogs(raw), source, error };
}