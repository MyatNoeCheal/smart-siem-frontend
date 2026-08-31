import api from "./api";
import { withMockFallback } from "./withMockFallback";
import { transformAiInsights } from "./transformers/aiInsightsTransformer";
import { mockAiInsightsRaw } from "./mock/mockAiInsights";

export async function getAiInsights() {
  const { raw, source, error } = await withMockFallback(
    () => api.get("/ai-insights").then((r) => r.data),
    mockAiInsightsRaw,
    "getAiInsights"
  );
  return { data: transformAiInsights(raw), source, error };
}