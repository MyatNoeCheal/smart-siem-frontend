import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformFraud } from "./transformers/fraudTransformer";
import { mockFraudRaw } from "./mock/mockFraud";

export async function getFraudDetections(params = {}) {
  const { raw, source, error } = await withMockFallback(
    () => api.get("/fraud", { params }).then((r) => r.data),
    mockFraudRaw,
    "getFraudDetections"
  );
  return { data: transformFraud(raw), source, error };
}