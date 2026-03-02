import { Plus, Compass, Settings } from "lucide-react";
import { cn } from "../../../shared/utils/cn";
import Avatar from "../../../shared/ui/Avatar";
import { useNavigate } from "react-router-dom";

export default function ServerSidebar() {
    const navigate = useNavigate();
    const servers = [
        { id: 1, name: "Gaming", active: true, color: "bg-indigo-600" },
        { id: 2, name: "Music", color: "bg-emerald-500" },
    ];

    return (
        <aside className="w-[72px] flex flex-col items-center py-3 bg-[#090B11] border-r border-white/5 shrink-0">
            {/* Home Button */}
            <div className="relative group mb-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full scale-y-100 group-hover:scale-y-100 transition-transform origin-left" />
                <button className="h-12 w-12 flex items-center justify-center rounded-[16px] bg-indigo-600 text-white transition-all duration-200">
                    <img src="/logo.svg" alt="N" className="h-8 w-8" onError={(e) => (e.currentTarget.src = 'https://api.dicebear.com/7.x/initials/svg?seed=N')} />
                </button>
            </div>

            <div className="w-8 h-[2px] bg-white/10 rounded-full mb-2" />

            {/* Server List */}
            <div className="flex-1 w-full flex flex-col items-center gap-2 overflow-y-auto no-scrollbar">
                {servers.map((server) => (
                    <button
                        key={server.id}
                        className={cn(
                            "h-12 w-12 flex items-center justify-center rounded-[24px] hover:rounded-[16px] transition-all duration-200 group relative",
                            server.color
                        )}
                    >
                        <span className="text-sm font-bold">{server.name[0]}</span>
                        {server.active && (
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-2 bg-white rounded-r-full" />
                        )}
                    </button>
                ))}

                <button className="h-12 w-12 flex items-center justify-center rounded-[24px] hover:rounded-[16px] bg-white/5 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-200">
                    <Plus size={24} />
                </button>

                <button className="h-12 w-12 flex items-center justify-center rounded-[24px] hover:rounded-[16px] bg-white/5 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-200">
                    <Compass size={24} />
                </button>
            </div>

            {/* Bottom Icons */}
            <button
                onClick={() => navigate("/settings")}
                className="h-12 w-12 mb-2 flex items-center justify-center rounded-[24px] hover:rounded-[16px] bg-white/5 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-200"
            >
                <Settings size={24} />
            </button>

            <button className="h-12 w-12 mb-4 flex items-center justify-center rounded-[24px] hover:rounded-[16px] bg-white/5 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all duration-200">
                <Avatar fallback="AI" size="sm" className="bg-transparent" src="https://api.dicebear.com/7.x/bottts/svg?seed=Nexa" />
            </button>
        </aside>
    );
}
