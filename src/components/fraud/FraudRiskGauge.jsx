function riskColor(score) {
  if (score >= 85) return "#FB4B5D";
  if (score >= 60) return "#F5A623";
  if (score >= 30) return "#F5D547";
  return "#33D69F";
}

export default function FraudRiskGauge({ score }) {
  const r = 62, c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score ?? 0));
  const offset = c - (pct / 100) * c;
  const color = riskColor(pct);

  return (
    <svg width="150" height="150" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="12" />
      <circle
        cx="75" cy="75" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset} transform="rotate(-90 75 75)"
        style={{ transition: "stroke-dashoffset .8s ease" }}
      />
      <text x="75" y="70" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="30" fontWeight="700" fill={color}>
        {Math.round(pct)}
      </text>
      <text x="75" y="92" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill="#8B96AC">AVG RISK</text>
    </svg>
  );
}