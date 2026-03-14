import { Users, MessageSquare, Users2, Mic2, Headphones, Settings } from "lucide-react";
import { cn } from "../../../shared/utils/cn";
import Avatar from "../../../shared/ui/Avatar";
import Badge from "../../../shared/ui/Badge";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function NavSidebar() {

    const {user} = useAuth();
    const navigate = useNavigate();

    const mainItems = [
        { icon: Users, label: "Friends", active: true },
        { icon: MessageSquare, label: "Direct Messages", badge: 4 },
        { icon: Users2, label: "Group Messages" },
    ];

    // const recommendedPeople = [
    //     { name: "Luna_Cyber", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna" },
    //     { name: "Ethan_Dev", status: "idle", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" },
    //     { name: "Dexter_01", status: "dnd", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dexter" },
    //     { name: "SarahVox", status: "online", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    // ];

    return (
        <aside className="w-60 flex flex-col bg-[#0F121D] shrink-0 overflow-hidden">
            {/* Header */}
            <div className="h-12 px-4 flex items-center border-b border-white/5 shadow-sm">
                <h1 className="font-bold text-sm tracking-wide flex items-center gap-2">
                    NEXATALK <Badge variant="primary" className="text-[8px] px-1 py-0 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">PRO</Badge>
                </h1>
            </div>

            {/* Main Nav */}
            <div className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto no-scrollbar">
                {mainItems.map((item) => (
                    <button
                        key={item.label}
                        className={cn(
                            "w-full px-3 py-2 flex items-center gap-3 rounded-lg transition-colors group",
                            item.active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/80"
                        )}
                    >
                        <item.icon size={20} className={item.active ? "text-indigo-400" : "text-white/40 group-hover:text-white/60"} />
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        {item.badge && <Badge variant="primary" className="bg-indigo-600">{item.badge}</Badge>}
                    </button>
                ))}

                {/* <div className="mt-8 mb-4 px-3">
                    <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recommended Servers</h2>
                </div> */}

                {/* <div className="mt-8 mb-4 px-3">
                    <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recommended People</h2>
                </div>

                <div className="space-y-1">
                    {recommendedPeople.map((person) => (
                        <button key={person.name} className="w-full px-3 py-1.5 flex items-center gap-3 rounded-lg hover:bg-white/5 transition-colors group">
                            <Avatar src={person.avatar} fallback={person.name} status={person.status as any} size="sm" />
                            <span className="text-sm font-semibold text-white/70 group-hover:text-white">{person.name}</span>
                        </button>
                    ))}
                </div> */}
            </div>

            {/* User Status Footer */}
            <div className="p-2 bg-[#090B11] flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <Avatar status="online" fallback={user?.username?.slice(0,2).toUpperCase()?? "NA"} size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{user?.username}</p>
                        {/* <p className="text-[10px] text-white/40 truncate">#5412 • Online</p> */}
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                    <button className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                        <Mic2 size={16} />
                    </button>
                    <button className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors">
                        <Headphones size={16} />
                    </button>
                    <button 
                        onClick={() => navigate("/settings")}
                        className="p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
