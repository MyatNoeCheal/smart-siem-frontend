import clsx from "clsx";

const STYLES = {
  critical: "bg-risk-critical/10 text-risk-critical ring-risk-critical/25",
  high: "bg-risk-high/10 text-risk-high ring-risk-high/25",
  medium: "bg-risk-medium/10 text-risk-medium ring-risk-medium/25",
  low: "bg-risk-low/10 text-risk-low ring-risk-low/25",
  mock: "bg-command-violet/10 text-command-violet ring-command-violet/25",
  live: "bg-command-cyan/10 text-command-cyan ring-command-cyan/25",
};

export default function StatusBadge({ level = "low", children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ring-1",
        STYLES[level] || STYLES.low
      )}
    >
      {children || level}
    </span>
  );
}