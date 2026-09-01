// Only renders real numbers from the backend's evaluation output
// (see evaluate_model.py's metrics_summary.json). Never fabricates
// metrics — shows an honest "not available" state instead.
export default function ModelMetricsCard({ metrics }) {
  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 backdrop-blur-sm h-full">
      <h2 className="text-sm font-medium text-slate-300 mb-3">Model Evaluation Metrics</h2>

      {!metrics ? (
        <div className="text-xs text-slate-500 py-6 text-center">
          No evaluation metrics endpoint available yet. Run evaluate_model.py
          and expose its metrics_summary.json via a backend endpoint to
          populate this panel.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          <MetricTile label="Precision" value={metrics.precision} />
          <MetricTile label="Recall" value={metrics.recall} />
          <MetricTile label="F1 Score" value={metrics.f1_score} />
          <MetricTile label="AUPRC" value={metrics.auprc} />
        </div>
      )}
    </div>
  );
}

function MetricTile({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-3 text-center">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <div className="text-lg font-mono text-cyan-400">
        {typeof value === 'number' ? value.toFixed(3) : '—'}
      </div>
    </div>
  );
}