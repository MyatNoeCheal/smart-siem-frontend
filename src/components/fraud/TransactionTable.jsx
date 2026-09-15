const STATUS_COLORS = {
  new: 'bg-command-cyan/10 text-command-cyan',
  investigating: 'bg-risk-high/10 text-risk-high',
  resolved: 'bg-risk-low/10 text-risk-low',
};

export default function TransactionTable({ transactions, onSelect, selectedId }) {
  if (!transactions?.length) {
    return <div className="py-8 text-center text-sm text-navy-400">No flagged transactions.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-xs uppercase tracking-wide text-navy-400">
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
              className={`cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.03] ${
                selectedId === t.id ? 'bg-white/[0.05]' : ''
              }`}
            >
              <td className="py-2 pr-4 font-mono text-command-cyan">{t.id}</td>
              <td className="py-2 pr-4 text-navy-100">{t.user}</td>
             <td className="py-2 pr-4 text-navy-100">{t.amount != null ? `$${t.amount.toLocaleString()}` : '—'}</td>
              <td className="py-2 pr-4 text-xs text-navy-400">{new Date(t.timestamp).toLocaleString()}</td>
              <td className="py-2 pr-4">
                <RiskBadge score={t.risk_score} />
              </td>
              <td className="py-2 pr-4">
                <span className={t.classification === 'Fraud' ? 'font-medium text-risk-critical' : 'text-navy-400'}>
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
  const color = score >= 70 ? 'text-risk-critical' : score >= 40 ? 'text-risk-high' : 'text-risk-low';
  return <span className={`font-mono font-semibold ${color}`}>{score}</span>;
}