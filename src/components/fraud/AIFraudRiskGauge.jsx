export default function AIFraudRiskGauge({ score = 0 }) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 70 ? '#f43f5e' : pct >= 40 ? '#fb923c' : '#34d399';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 backdrop-blur-sm flex flex-col items-center justify-center">
      <h2 className="text-sm font-medium text-slate-300 mb-3 self-start">AI Fraud Risk</h2>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="70" cy="70" r="54" fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x="70" y="76" textAnchor="middle" fontSize="24" fontWeight="700" fill={color} fontFamily="monospace">
          {pct.toFixed(0)}
        </text>
      </svg>
      <p className="text-xs text-slate-500 mt-2">Average risk across recent transactions</p>
    </div>
  );
}