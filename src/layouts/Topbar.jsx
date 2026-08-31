import { useEffect, useState } from "react";
import { Bell, Search, Menu, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Topbar({ onOpenMobileNav }) {
  const { theme, toggleTheme } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-navy-900/80 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onOpenMobileNav}
        className="rounded-lg p-2 text-navy-100 hover:bg-white/[0.05] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-navy-800/60 px-3.5 py-2 text-navy-400 md:flex md:w-72">
        <Search className="h-4 w-4 shrink-0" />
        <input
          type="text"
          placeholder="Search events, IPs, users…"
          className="w-full bg-transparent text-[13px] text-navy-50 placeholder:text-navy-400 focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-risk-low/20 bg-risk-low/[0.08] px-3 py-1.5 sm:flex">
          <span className="status-dot h-2 w-2 rounded-full bg-risk-low" />
          <span className="font-mono text-[11px] font-medium text-risk-low">
            SYSTEMS OPERATIONAL
          </span>
        </div>

        <div className="hidden flex-col items-end leading-tight md:flex">
          <span className="font-mono text-[12px] text-navy-50">{timeStr}</span>
          <span className="font-mono text-[10px] text-navy-400">{dateStr}</span>
        </div>

        <button className="relative rounded-lg p-2 text-navy-100 hover:bg-white/[0.05]">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-risk-critical px-1 font-mono text-[9px] font-bold text-white">
            3
          </span>
        </button>

        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-navy-100 hover:bg-white/[0.05]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>

        <button className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-navy-800/60 py-1.5 pl-1.5 pr-2.5 hover:border-command-cyan/30">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-command-blue to-command-violet text-[11px] font-semibold text-white">
            AN
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block font-body text-[12px] font-medium text-navy-50">Analyst</span>
            <span className="block font-mono text-[10px] text-navy-400">SOC Tier 1</span>
          </span>
          <ChevronDown className="hidden h-3.5 w-3.5 text-navy-400 sm:block" />
        </button>
      </div>
    </header>
  );
}