import GlassPanel from "../ui/GlassPanel";

const METRIC_LABELS = { precision: "Precision", recall: "Recall", f1: "F1 Score", auprc: "AUPRC" };

export default function FraudModelMetricsCard({ metrics, source }) {
  if (!metrics) return null;
  return (
    <GlassPanel>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-[14px] font-semibold text-navy-50">Model Evaluation Metrics</h2>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">
          {source === "live" ? "live" : "static · offline test set"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(METRIC_LABELS).map(([key, label]) => (
          <div key={key} className="rounded-lg border border-white/[0.06] bg-navy-900/40 p-3 text-center">
            <p className="font-display text-xl font-semibold text-command-cyan">
              {metrics[key] != null ? metrics[key].toFixed(3) : "—"}
            </p>
            <p className="mt-0.5 text-[10.5px] text-navy-400">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10.5px] leading-relaxed text-navy-500">
        {source === "live"
          ? "Reported by the backend's model metrics endpoint."
          : "Held-out test-set results from the Autoencoder's offline evaluation (evaluate_model.py) — not computed live, since live checkout events don't carry the PCA-anonymized feature vector this model was trained on."}
      </p>
    </GlassPanel>
  );
}