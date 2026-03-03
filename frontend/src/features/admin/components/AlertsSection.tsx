import { type ElementType } from "react";
import { AlertTriangle, Cpu, Hammer } from "lucide-react";
import { cn } from "../../../shared/utils/cn";

interface AlertItemProps {
    icon: ElementType;
    title: string;
    description: string;
    actionLabel?: string;
    variant: "warning" | "danger" | "info";
}

const AlertItem = ({ icon: Icon, title, description, actionLabel, variant }: AlertItemProps) => {
    const variants = {
        warning: "bg-amber-500/5 border-amber-500/20 text-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.02)]",
        danger: "bg-rose-500/5 border-rose-500/20 text-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.02)]",
        info: "bg-white/5 border-white/10 text-gray-400",
    };

    const iconBg = {
        warning: "bg-amber-500/10",
        danger: "bg-rose-500/10",
        info: "bg-white/10",
    };

    return (
        <div className={cn("border rounded-2xl p-5 mb-4 group hover:scale-[1.02] transition-all cursor-pointer", variants[variant])}>
            <div className="flex items-start gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg[variant])}>
                    <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{title}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-3 leading-relaxed">{description}</p>
                    {actionLabel && (
                        <button className="bg-amber-500 text-black text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-amber-400 transition-colors shadow-[0_4px_20px_rgba(245,158,11,0.3)]">
                            {actionLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function AlertsSection() {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Critical Alerts</h3>

            <AlertItem
                icon={AlertTriangle}
                title="5 Reports Need Review"
                description="High priority harassment flags."
                actionLabel="Review Now"
                variant="warning"
            />

            <AlertItem
                icon={Cpu}
                title="Server Flagged by AI"
                description="Suspicious bot activity detected in Server ID: #9921."
                variant="danger"
            />

            <AlertItem
                icon={Hammer}
                title="Maintenance Mode"
                description="Scheduled for 03:00 AM UTC."
                variant="info"
            />
        </div>
    );
}
