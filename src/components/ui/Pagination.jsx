import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, total, pageSize, onChange }) {
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
      <p className="font-mono text-[11px] text-navy-500">
        {total > 0 ? `${rangeStart.toLocaleString()}–${rangeEnd.toLocaleString()} of ${total.toLocaleString()}` : "0 results"}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-navy-800/60 px-2.5 py-1.5 font-mono text-[11px] text-navy-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </button>
        <span className="font-mono text-[11px] text-navy-400">Page {page} of {Math.max(totalPages, 1)}</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 rounded-lg border border-white/[0.08] bg-navy-800/60 px-2.5 py-1.5 font-mono text-[11px] text-navy-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}