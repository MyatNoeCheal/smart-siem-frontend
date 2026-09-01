import StatusBadge from "../ui/StatusBadge";

function riskLevel(score) {
  if (score == null) return "low";
  if (score >= 85) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export default function FraudTransactionTable({ transactions, getStatus, onSelect, selectedId }) {
  if (!transactions.length) {
    return <p className="py-8 text-center text-[13px] text-navy-400">No flagged transactions yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wider text-navy-400">
            <th className="pb-2.5 font-mono font-normal">Txn ID</th>
            <th className="pb-2.5 font-mono font-normal">User</th>
            <th className="pb-2.5 font-mono font-normal">Amount</th>
            <th className="pb-2.5 font-mono font-normal">Timestamp</th>
            <th className="pb-2.5 font-mono font-normal">Risk Score</th>
            <th className="pb-2.5 font-mono font-normal">Classification</th>
            <th className="pb-2.5 font-mono font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.03] ${selectedId === t.id ? "bg-command-cyan/[0.06]" : ""}`}
            >
              <td className="py-2.5 font-mono text-navy-400">{t.id}</td>
              <td className="py-2.5 text-navy-50">{t.userId}</td>
              <td className="py-2.5 font-mono text-navy-100">{t.amount != null ? `$${t.amount.toLocaleString()}` : "—"}</td>
              <td className="py-2.5 font-mono text-navy-400">{t.timestamp ? new Date(t.timestamp).toLocaleString() : "—"}</td>
              <td className="py-2.5 font-mono text-navy-100">{t.riskScore ?? "—"}</td>
              <td className="py-2.5"><StatusBadge level={riskLevel(t.riskScore)}>{riskLevel(t.riskScore)}</StatusBadge></td>
              <td className="py-2.5 capitalize text-navy-400">{getStatus(t.id).replace("_", " ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}