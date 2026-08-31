import { AlertCircle, Loader2 } from "lucide-react";

export default function AsyncState({ loading, error, isEmpty, onRetry, emptyLabel = "Nothing to show yet.", children }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-navy-400">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="font-mono text-[11px] uppercase tracking-wider">Loading…</span>
      </div>
    );
  }

  if (error && isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <AlertCircle className="h-5 w-5 text-risk-high" />
        <p className="text-[12.5px] text-navy-100/80">Couldn't reach the API.</p>
        <p className="max-w-xs text-[11px] text-navy-400">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 rounded-lg border border-white/[0.08] bg-navy-800/60 px-3 py-1.5 text-[11px] text-navy-100 hover:border-command-cyan/30"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return <p className="py-10 text-center text-[13px] text-navy-400">{emptyLabel}</p>;
  }

  return children;
}