const TONES = {
  default: 'text-command-cyan bg-command-cyan/10',
  warning: 'text-risk-high bg-risk-high/10',
  critical: 'text-risk-critical bg-risk-critical/10',
};

export default function FraudStatCard({ label, value, tone = 'default' }) {
  return (
    <div className="glass-panel p-4">
      <div className={`mb-2 inline-flex rounded-md px-2 py-1 text-[11px] font-mono ${TONES[tone]}`}>
        {label.toUpperCase()}
      </div>
      <div className="font-mono text-2xl font-semibold text-navy-50">{value}</div>
    </div>
  );
}