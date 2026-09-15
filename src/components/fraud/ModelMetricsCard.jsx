// Only renders real numbers from the backend's evaluation output
// (see evaluate_model.py's metrics_summary.json). Never fabricates
// metrics — shows an honest "not available" state instead.
export default function ModelMetricsCard({ metrics }) {
  return (
    <div className="glass-panel h-full p-4">
      <h2 className="mb-3 font-display text-sm font-medium text-navy-100">Model Evaluation Metrics</h2>

      {!metrics ? (
        <div className="py-6 text-center text-xs text-navy-400">
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
    <div className="rounded-lg border border-white/[0.08] bg-navy-900/50 p-3 text-center">
      <div className="mb-1 text-[11px] text-navy-400">{label}</div>
      <div className="font-mono text-lg text-command-cyan">
        {typeof value === 'number' ? value.toFixed(3) : '—'}
      </div>
    </div>
  );
}