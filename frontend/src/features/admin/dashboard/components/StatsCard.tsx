import type { LucideIcon } from "lucide-react";
import { cn } from "../../../../shared/utils/cn";

interface StatsCardProps {
    title: string;
    value: string;
    subtext?: string;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    alert?: boolean;
}

export default function StatsCard({ title, value, subtext, icon: Icon, trend, alert }: StatsCardProps) {
    return (
        <div className={cn(
            "bg-[#151926]/50 border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10 group relative overflow-hidden",
            alert && "border-amber-500/20 bg-amber-500/5 shadow-[0_0_50px_rgba(245,158,11,0.05)]"
        )}>
            {alert && (
                <div className="absolute top-0 right-0 p-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                        <Icon size={24} className="text-amber-500" />
                    </div>
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{title}</span>
                    <h2 className="text-3xl font-bold text-white tracking-tight">{value}</h2>
                </div>
                {!alert && (
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <Icon size={20} className="text-gray-400 group-hover:text-white" />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2">
                {trend && (
                    <span className={cn(
                        "text-[10px] font-bold flex items-center gap-0.5",
                        trend.isPositive ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {trend.isPositive ? "↑" : "↓"} {trend.value}
                    </span>
                )}
                {subtext && (
                    <span className={cn(
                        "text-[10px] font-medium transition-colors",
                        alert ? "text-amber-500" : "text-gray-500"
                    )}>
                        {subtext}
                    </span>
                )}
            </div>
        </div>
    );
}
