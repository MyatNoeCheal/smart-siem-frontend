import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/overview").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="dp-page">
      <h1 className="dp-title">Overview</h1>
      <p className="dp-sub">Real-time counts from the SIEM, same data JARVIS reads from.</p>

      {error && <p className="dp-error">{error}</p>}
      {!data && !error && <p className="dp-empty">Loading…</p>}

      {data && (
        <>
          <div className="dp-kpi-grid">
            <div className="dp-kpi-card">
              <div className="dp-kpi-label">Total Events</div>
              <div className="dp-kpi-value">{(data.total_events ?? 0).toLocaleString()}</div>
            </div>
            <div className="dp-kpi-card">
              <div className="dp-kpi-label">Critical Events</div>
              <div className="dp-kpi-value dp-kpi-critical">{(data.critical_events ?? 0).toLocaleString()}</div>
            </div>
            <div className="dp-kpi-card">
              <div className="dp-kpi-label">AI Anomalies</div>
              <div className="dp-kpi-value">{(data.anomalies ?? 0).toLocaleString()}</div>
            </div>
          </div>

          <h2 className="dp-subtitle">Events by category</h2>
          <div className="dp-kpi-grid">
            {Object.entries(data.events_by_category || {}).map(([cat, count]) => (
              <div className="dp-kpi-card" key={cat}>
                <div className="dp-kpi-label">{cat.replace("_", " ")}</div>
                <div className="dp-kpi-value">{count.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
