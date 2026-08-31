export default function StageBanner({ stage, stageIndex, stageCount }) {
  if (!stage) return null;
  const progressPct = Math.round((stageIndex / stageCount) * 100);

  return (
    <div className="mb-4 rounded-xl border border-command-cyan/20 bg-command-cyan/[0.05] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-command-cyan">
            {stage.label}
          </p>
          <p className="mt-0.5 truncate text-[12.5px] text-navy-100/80">{stage.detail}</p>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-navy-400">
          {stageIndex}/{stageCount}
        </span>
      </div>
      <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-navy-700/60">
        <div
          className="h-full rounded-full bg-command-cyan transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}