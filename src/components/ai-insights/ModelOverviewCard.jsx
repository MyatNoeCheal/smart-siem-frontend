import clsx from "clsx";

export default function ModelOverviewCard({ model }) {
  const active = model.status === "active";
  return (
    <div className="rounded-xl border border-white/[0.06] bg-navy-900/40 p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-[14px] font-semibold text-navy-50">{model.name}</p>
          <p className="font-mono text-[10.5px] text-navy-500">{model.type}</p>
        </div>
        <span
          className={clsx(
            "shrink-0 rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider",
            active ? "border-risk-low/30 bg-risk-low/10 text-risk-low" : "border-navy-500/30 bg-navy-500/10 text-navy-400"
          )}
        >
          {model.status}
        </span>
      </div>
      <p className="mb-2 text-[12px] leading-relaxed text-navy-100/80">{model.description}</p>
      <p className="mb-3 text-[10.5px] text-navy-500">{model.note}</p>

      {model.metrics ? (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="font-mono text-[9.5px] uppercase tracking-wider text-navy-500">Evaluation Metrics</p>
            <span className="font-mono text-[9px] uppercase tracking-wider text-navy-500">
              {model.metricsSource === "live" ? "live" : "static · offline test set"}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["precision", "recall", "f1", "auprc"].map((k) => (
              <div key={k} className="rounded-lg border border-white/[0.06] bg-navy-950/40 p-2 text-center">
                <p className="font-display text-[13px] font-semibold text-command-cyan">
                  {model.metrics[k] != null ? model.metrics[k].toFixed(2) : "—"}
                </p>
                <p className="text-[9px] uppercase text-navy-500">{k}</p>
              </div>
            ))}
          </div>
        </div>
      ) : model.unsupervisedNote ? (
        <p className="rounded-lg border border-white/[0.06] bg-navy-950/40 p-2.5 text-[10.5px] leading-relaxed text-navy-400">
          {model.unsupervisedNote}
        </p>
      ) : null}
    </div>
  );
}