import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

export default function AIInsights() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/ai-insights").then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="dp-page">
      <h1 className="dp-title">AI Insights</h1>
      <p className="dp-sub">Rule-based summary across the most recent events -- same source JARVIS reads from when you ask "what's going on."</p>
      {error && <p className="dp-error">{error}</p>}
      {!data && !error && <p className="dp-empty">Loading…</p>}

      {data && (
        <>
          <div className="dp-panel">
            <div className="dp-panel-title">Summary</div>
            <p className="dp-summary-text">{data.summary}</p>
          </div>

          {data.top_risks?.length > 0 && (
            <div className="dp-panel">
              <div className="dp-panel-title">Top Risks</div>
              <ul className="dp-risk-list">
                {data.top_risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
