export default function TransactionInvestigationPanel({ transaction, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-end z-50" onClick={onClose}>
      <div
        className="h-full w-full max-w-md bg-slate-900 border-l border-slate-800 p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-100">Transaction Investigation</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">✕</button>
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
                <span key={f.feature} className="px-2 py-1 rounded-full text-xs bg-slate-800 border border-slate-700 text-slate-300">
                  {f.feature} <b className="text-cyan-400">{f.contribution_pct}%</b>
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
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
      <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}