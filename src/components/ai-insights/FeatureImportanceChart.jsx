import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function FeatureImportanceChart({ features }) {
  if (!features?.length) {
    return (
      <p className="py-6 text-center text-[12px] text-navy-400">
        No feature attribution available for this item.
      </p>
    );
  }

  const data = features.map((f) => ({ name: f.feature, pct: f.contribution_pct }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={Math.max(140, data.length * 32)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" horizontal={false} />
          <XAxis type="number" domain={[0, "dataMax"]} tick={{ fill: "#4C5A78", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} unit="%" />
          <YAxis type="category" dataKey="name" width={90} tick={{ fill: "#8B96AC", fontSize: 10.5, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: "#0B1220", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, fontSize: 12 }} formatter={(v) => [`${v}%`, "Contribution"]} />
          <Bar dataKey="pct" fill="#8B7CF6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-[10px] leading-relaxed text-navy-500">
        Reconstruction-error attribution — each bar shows how much that feature contributed to the anomaly score.
        This is single-direction (all features push the score up by construction), not a signed SHAP decomposition —
        a true positive/negative breakdown is only computed offline for evaluation and is documented to diverge
        from this live method for some sparse features.
      </p>
    </div>
  );
}