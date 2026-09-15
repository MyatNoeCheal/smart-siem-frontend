import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import DataTable from "../components/DataTable";

export default function Fraud() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/fraud").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="dp-page">
      <h1 className="dp-title">Fraud Detection</h1>
      <p className="dp-sub">Transaction & payment anomaly monitoring.</p>
      {error && <p className="dp-error">{error}</p>}

      {data && (
        <div className="dp-kpi-grid" style={{ marginBottom: 20 }}>
          <div className="dp-kpi-card">
            <div className="dp-kpi-label">Flagged Transactions</div>
            <div className="dp-kpi-value">{data.count ?? 0}</div>
          </div>
          <div className="dp-kpi-card">
            <div className="dp-kpi-label">Total Flagged Amount</div>
            <div className="dp-kpi-value">${(data.total_flagged_amount ?? 0).toLocaleString()}</div>
          </div>
        </div>
      )}

      <DataTable
        rows={data?.results}
        emptyLabel={data === null ? "Loading…" : "No flagged transactions."}
        columns={[
          { key: "timestamp", label: "Timestamp" },
          { key: "user_id", label: "User" },
          { key: "ip", label: "IP", render: (r) => <code>{r.ip || "—"}</code> },
          { key: "amount", label: "Amount", render: (r) => (r.amount != null ? `$${Number(r.amount).toLocaleString()}` : "—") },
          { key: "risk_score", label: "Risk Score" },
        ]}
      />
    </div>
  );
}
