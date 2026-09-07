export default function AnomalyScorePanel({ item }) {
  if (!item) return <p className="py-6 text-center text-[12px] text-navy-400">Select an item to inspect its anomaly score.</p>;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-navy-400">Risk Score</span>
        <span className="font-mono text-[13px] text-navy-50">{item.riskScore ?? "—"} / 100</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-navy-400">Reconstruction Error</span>
        <span className="font-mono text-[13px] text-navy-50">
          {item.reconstructionError != null ? item.reconstructionError.toFixed(4) : "not exposed by this endpoint"}
        </span>
      </div>
      {item.reconstructionError == null && (
        <p className="text-[10.5px] leading-relaxed text-navy-500">
          This item's raw reconstruction error isn't included in the API response used here — see the Fraud
          Detection page's Model Evaluation card for aggregate error-distribution statistics instead.
        </p>
      )}
    </div>
  );
}