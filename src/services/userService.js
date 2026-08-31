import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformUserBehavior } from "./transformers/userBehaviorTransformer";
import { mockUserBehaviorRaw } from "./mock/mockUserBehavior";

export async function getUserBehavior(params = {}) {
  const { raw, source, error } = await withMockFallback(
    () => api.get("/user-behavior", { params }).then((r) => r.data),
    mockUserBehaviorRaw,
    "getUserBehavior"
  );
  return { data: transformUserBehavior(raw), source, error };
}