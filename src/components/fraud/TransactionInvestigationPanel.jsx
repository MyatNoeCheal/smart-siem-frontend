export default function TransactionInvestigationPanel({ transaction, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto border-l border-command-cyan/20 bg-navy-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-50">Transaction Investigation</h2>
          <button onClick={onClose} className="text-navy-400 hover:text-command-cyan">✕</button>
        </div>

        <Section title="Transaction Information">
          <Field label="ID" value={transaction.id} mono />
          <Field label="User" value={transaction.user} />
          <Field label="Amount" value={`$${transaction.amount?.toLocaleString()}`} />
          <Field label="Timestamp" value={new Date(transaction.timestamp).toLocaleString()} />
        </Section>

        <Section title="AI Risk Assessment">
          <Field label="Risk Score" value={transaction.risk_score} />
          <Field label="Classification" value={transaction.classification} />
          <Field label="Reason" value={transaction.reason || '—'} />
        </Section>

        {transaction.top_features?.length > 0 && (
          <Section title="Top Contributing Features (XAI)">
            <div className="flex flex-wrap gap-2">
              {transaction.top_features.map((f) => (
                <span key={f.feature} className="rounded-full border border-white/[0.08] bg-navy-800 px-2 py-1 text-xs text-navy-100">
                  {f.feature} <b className="text-command-cyan">{f.contribution_pct}%</b>
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-navy-400">
              Shows which features drove the model's reconstruction error most —
              not a guarantee of what those features represent in business terms.
            </p>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 text-xs uppercase tracking-wide text-navy-400">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-navy-400">{label}</span>
      <span className={`text-navy-100 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}