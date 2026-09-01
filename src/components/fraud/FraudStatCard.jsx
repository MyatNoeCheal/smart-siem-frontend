const TONES = {
  default: 'text-cyan-400 bg-cyan-500/10',
  warning: 'text-amber-400 bg-amber-500/10',
  critical: 'text-rose-400 bg-rose-500/10',
};

export default function FraudStatCard({ label, value, tone = 'default' }) {
  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 backdrop-blur-sm">
      <div className={`inline-flex px-2 py-1 rounded-md text-[11px] font-mono mb-2 ${TONES[tone]}`}>
        {label.toUpperCase()}
      </div>
      <div className="text-2xl font-semibold text-slate-100 font-mono">{value}</div>
    </div>
  );
}