import { Search } from "lucide-react";

export default function UserSearchBox({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-navy-900/60 px-3 py-1.5">
      <Search className="h-3.5 w-3.5 text-navy-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by User ID…"
        className="w-40 bg-transparent text-[12px] text-navy-50 outline-none placeholder:text-navy-500 sm:w-56"
      />
    </div>
  );
}