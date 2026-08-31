export function transformAiInsights(raw) {
  return {
    summary: raw?.summary || "No summary available.",
    topRisks: raw?.top_risks || [],
    generatedAt: raw?.generated_at || null,
  };
}