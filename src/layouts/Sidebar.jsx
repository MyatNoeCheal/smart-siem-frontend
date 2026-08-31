import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  CreditCard,
  UserRoundSearch,
  UserCog,
  BrainCircuit,
  ScrollText,
  ChevronsLeft,
  ShieldHalf,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { to: "/overview", label: "Overview", icon: LayoutDashboard },
  { to: "/threats", label: "Threats", icon: ShieldAlert },
  { to: "/fraud-detection", label: "Fraud Detection", icon: CreditCard },
  { to: "/user-behavior", label: "User Behavior", icon: UserRoundSearch },
  { to: "/admin-activity", label: "Admin Activity", icon: UserCog },
  { to: "/ai-insights", label: "AI Insights", icon: BrainCircuit },
  { to: "/logs", label: "Logs", icon: ScrollText },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/[0.06] bg-navy-900/95 backdrop-blur-xl transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          collapsed ? "lg:w-[76px]" : "lg:w-[248px]",
          mobileOpen ? "translate-x-0 w-[248px]" : "-translate-x-full w-[248px]"
        )}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/[0.06] px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-command-cyan/20 to-command-blue/20 ring-1 ring-command-cyan/30">
            <ShieldHalf className="h-5 w-5 text-command-cyan" />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate font-display text-[13px] font-semibold tracking-wide text-navy-50">
                SMART SIEM
              </p>
              <p className="truncate font-mono text-[10px] tracking-widest text-navy-400">
                AI COMMAND CENTER
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-command-cyan/[0.10] text-command-cyan ring-1 ring-command-cyan/20"
                    : "text-navy-100/70 hover:bg-white/[0.04] hover:text-navy-50"
                )
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={onToggle}
          className="hidden shrink-0 items-center gap-2 border-t border-white/[0.06] px-4 py-3 text-navy-400 hover:text-navy-50 lg:flex"
        >
          <ChevronsLeft
            className={clsx("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </aside>
    </>
  );
}