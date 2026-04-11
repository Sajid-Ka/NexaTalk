import React from "react";
import { cn } from "../utils/cn";

interface ServerIconProps {
  name: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
}

const ServerIcon: React.FC<ServerIconProps> = ({
  name,
  icon,
  active,
  onClick,
  className,
  tooltip,
}) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative group mb-2">
      {/* Icon Button */}
      <button
        onClick={onClick}
        className={cn(
          "h-12 w-12 flex items-center justify-center transition-all duration-300 rounded-full group relative",
          active 
            ? "bg-[#0B1020] text-white ring-2 ring-violet-500 ring-offset-2 ring-offset-[#090B11] shadow-[0_0_20px_rgba(139,92,246,0.6)]" 
            : "bg-white/5 text-white/70 hover:bg-violet-600 hover:text-white hover:ring-2 hover:ring-violet-500/50 hover:ring-offset-2 hover:ring-offset-[#090B11] hover:scale-105",
          className
        )}
      >
        {icon ? (
          <img
            src={icon}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-sm font-bold">{initials}</span>
        )}
      </button>

      {/* Tooltip */}
      {(tooltip || name) && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#090B11] border border-white/10 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none translate-x-1 group-hover:translate-x-0 z-[100] shadow-xl">
          {tooltip || name}
          {/* Tooltip Arrow */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-white/10" />
        </div>
      )}
    </div>
  );
};

export default ServerIcon;
