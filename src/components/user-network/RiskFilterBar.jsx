import clsx from "clsx";
import { RISK_LEVELS, RISK_FILTERS } from "./userNetworkTheme";

export default function RiskFilterBar({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {RISK_FILTERS.map((level) => {
        const active = value === level;
        const color = level === "all" ? "#22D3EE" : RISK_LEVELS[level].color;
        return (
          <button
            key={level}
            onClick={() => onChange(level)}
            className={clsx(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-wider transition-colors",
              active ? "border-white/20 bg-white/[0.08] text-navy-50" : "border-white/[0.06] text-navy-400 hover:text-navy-100"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {level}
          </button>
        );
      })}
    </div>
  );
}