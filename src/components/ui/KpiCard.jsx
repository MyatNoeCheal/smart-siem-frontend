import GlassPanel from "./GlassPanel";
import clsx from "clsx";

export default function KpiCard({ icon: Icon, label, value, tone = "cyan", trend }) {
  const toneMap = {
    cyan: "text-command-cyan bg-command-cyan/10 ring-command-cyan/20",
    blue: "text-command-blue bg-command-blue/10 ring-command-blue/20",
    critical: "text-risk-critical bg-risk-critical/10 ring-risk-critical/20",
    high: "text-risk-high bg-risk-high/10 ring-risk-high/20",
    violet: "text-command-violet bg-command-violet/10 ring-command-violet/20",
    low: "text-risk-low bg-risk-low/10 ring-risk-low/20",
  };

  return (
    <GlassPanel hoverable className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className={clsx("flex h-9 w-9 items-center justify-center rounded-lg ring-1", toneMap[tone])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {trend && (
          <span
            className={clsx(
              "font-mono text-[11px] font-medium",
              trend.startsWith("-") ? "text-risk-low" : "text-risk-high"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-navy-50">{value}</p>
        <p className="mt-0.5 text-[12px] text-navy-400">{label}</p>
      </div>
    </GlassPanel>
  );
}