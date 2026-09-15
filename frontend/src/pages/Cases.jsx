import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import DataTable, { SeverityBadge } from "../components/DataTable";

export default function Cases() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/cases")
      .then((d) => setRows(d.results || []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="dp-page">
      <h1 className="dp-title">Cases</h1>
      <p className="dp-sub">Investigation workflow -- grouped alerts an analyst is actively working.</p>
      {error && <p className="dp-error">{error}</p>}
      <DataTable
        rows={rows}
        emptyLabel={rows === null ? "Loading…" : "No cases yet."}
        columns={[
          { key: "title", label: "Title" },
          { key: "severity", label: "Severity", render: (r) => <SeverityBadge level={r.severity} /> },
          { key: "status", label: "Status" },
          { key: "alert_count", label: "Alerts" },
          { key: "assigned_to", label: "Assigned", render: (r) => r.assigned_to || "—" },
          { key: "updated_at", label: "Updated" },
        ]}
      />
    </div>
  );
}
