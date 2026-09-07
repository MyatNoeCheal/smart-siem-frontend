const STATUS_COLORS = {
  new: 'bg-cyan-500/10 text-cyan-400',
  investigating: 'bg-amber-500/10 text-amber-400',
  resolved: 'bg-emerald-500/10 text-emerald-400',
};

export default function TransactionTable({ transactions, onSelect, selectedId }) {
  if (!transactions?.length) {
    return <div className="text-sm text-slate-500 py-8 text-center">No flagged transactions.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-800">
            <th className="py-2 pr-4">Transaction</th>
            <th className="py-2 pr-4">User</th>
            <th className="py-2 pr-4">Amount</th>
            <th className="py-2 pr-4">Timestamp</th>
            <th className="py-2 pr-4">Risk Score</th>
            <th className="py-2 pr-4">Classification</th>
            <th className="py-2 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect(t)}
              className={`cursor-pointer border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors ${
                selectedId === t.id ? 'bg-slate-800/60' : ''
              }`}
            >
              <td className="py-2 pr-4 font-mono text-cyan-400">{t.id}</td>
              <td className="py-2 pr-4 text-slate-300">{t.user}</td>
             <td className="py-2 pr-4 text-slate-300">{t.amount != null ? `$${t.amount.toLocaleString()}` : '—'}</td>
              <td className="py-2 pr-4 text-slate-500 text-xs">{new Date(t.timestamp).toLocaleString()}</td>
              <td className="py-2 pr-4">
                <RiskBadge score={t.risk_score} />
              </td>
              <td className="py-2 pr-4">
                <span className={t.classification === 'Fraud' ? 'text-rose-400 font-medium' : 'text-slate-400'}>
                  {t.classification}
                </span>
              </td>
              <td className="py-2 pr-4">
                <span className={`px-2 py-0.5 rounded-full text-[11px] ${STATUS_COLORS[t.status] || ''}`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RiskBadge({ score }) {
  const color = score >= 70 ? 'text-rose-400' : score >= 40 ? 'text-amber-400' : 'text-emerald-400';
  return <span className={`font-mono font-semibold ${color}`}>{score}</span>;
}