import { Users, MessageSquare, Users2 } from "lucide-react";
import { cn } from "../../../shared/utils/cn";
import Badge from "../../../shared/ui/Badge";
import UserStatusFooter from "./UserStatusFooter";

export default function NavSidebar() {
  const mainItems = [
    { icon: Users, label: "Friends", active: true },
    { icon: MessageSquare, label: "Direct Messages", badge: 4 },
    { icon: Users2, label: "Group Messages" },
  ];

  return (
    <aside className="relative w-60 flex flex-col bg-[#0F121D] shrink-0">
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
      </div>

      {/* User Status Footer */}
      <UserStatusFooter />
    </aside>
  );
}
