import FeatureImportanceChart from "./FeatureImportanceChart";
import AnomalyScorePanel from "./AnomalyScorePanel";

export default function ExplainabilityPanel({ item }) {
  if (!item) {
    return <p className="py-8 text-center text-[12.5px] text-navy-400">Select an item on the left to see why it was flagged.</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Why was this suspicious?</p>
        {item.reason.length ? (
          <ul className="space-y-1.5">
            {item.reason.map((r, i) => (
              <li key={i} className="flex gap-2 text-[12.5px] text-navy-100/85">
                <span className="text-command-cyan">—</span> {r}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[12px] text-navy-500">
            No rule-engine reasons attached to this item — its flag came from the anomaly model alone.
          </p>
        )}
        <p className="mt-2 text-[10px] text-navy-500">Reasons shown here are exactly what the detection engine returned — nothing added.</p>
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <p className="mb-2 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Anomaly Score</p>
        <AnomalyScorePanel item={item} />
      </div>

      <div className="border-t border-white/[0.06] pt-4">
        <p className="mb-2 font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Feature Contribution</p>
        <FeatureImportanceChart features={item.topFeatures} />
      </div>
    </div>
  );
}