import { NavLink } from "react-router-dom";
import type { ElementType } from "react";
import { cn } from "../../utils/cn";

interface SettingsNavItemProps {
  label: string;
  to: string;
  icon?: ElementType;
  danger?: boolean;
}

export default function SettingsNavItem({
  label,
  to,
  icon: Icon,
  danger,
}: SettingsNavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-indigo-500/20 text-white"
            : danger
            ? "text-red-400 hover:bg-red-500/10"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        )
      }
    >
      {Icon && <Icon size={18} />}
      <span>{label}</span>
    </NavLink>
  );
}