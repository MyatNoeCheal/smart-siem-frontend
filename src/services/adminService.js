import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformAdminActivity } from "./transformers/adminActivityTransformer";
import { mockAdminActivityRaw } from "./mock/mockAdminActivity";

export async function getAdminActivity(params = {}) {
  const { raw, source, error } = await withMockFallback(
    () => api.get("/admin-activity", { params }).then((r) => r.data),
    mockAdminActivityRaw,
    "getAdminActivity"
  );
  return { data: transformAdminActivity(raw), source, error };
}