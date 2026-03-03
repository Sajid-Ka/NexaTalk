import type { LucideIcon } from "lucide-react";
import { cn } from "../../../shared/utils/cn";

interface CommissionCardProps {
    title: string;
    amount: string;
    icon: LucideIcon;
    variant?: "pink" | "blue" | "indigo";
}

export default function CommissionCard({ title, amount, icon: Icon, variant = "pink" }: CommissionCardProps) {
    const variants = {
        pink: "bg-rose-500/10 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]",
        blue: "bg-indigo-500/10 text-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)]",
        indigo: "bg-cyan-500/10 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    };

    return (
        <div className="bg-[#151926]/50 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-colors">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform hover:scale-105", variants[variant])}>
                <Icon size={24} />
            </div>
            <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5 block">{title}</span>
                <h2 className="text-xl font-bold text-white tracking-tight">{amount}</h2>
            </div>
        </div>
    );
}
