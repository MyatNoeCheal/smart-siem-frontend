import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import DataTable, { SeverityBadge } from "../components/DataTable";

export default function Threats() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/threats?limit=50&group_incidents=true&sort=priority")
      .then((d) => setRows(d.results || []))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="dp-page">
      <h1 className="dp-title">Threats</h1>
      <p className="dp-sub">Grouped incident alerts. JARVIS can mark any of these as investigating/resolved for you -- just ask, then confirm.</p>
      {error && <p className="dp-error">{error}</p>}
      <DataTable
        rows={rows}
        emptyLabel={rows === null ? "Loading…" : "No threats detected."}
        columns={[
          { key: "last_seen", label: "Last Seen" },
          { key: "ip", label: "IP", render: (r) => <code>{r.ip || "—"}</code> },
          { key: "event_type", label: "Event Type" },
          { key: "risk_level", label: "Severity", render: (r) => <SeverityBadge level={r.risk_level || r.severity} /> },
          { key: "priority_score", label: "Priority" },
          { key: "status", label: "Status" },
        ]}
      />
    </div>
  );
}
