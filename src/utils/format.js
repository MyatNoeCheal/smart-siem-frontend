export function formatNumber(n) {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US");
}

export function formatRiskScore(n) {
  if (n === null || n === undefined) return "—";
  return `${Math.round(n)}`;
}