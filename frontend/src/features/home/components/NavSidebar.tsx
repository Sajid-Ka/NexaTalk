import { Users, MessageSquare, Users2 } from "lucide-react";
import { cn } from "../../../shared/utils/cn";
import Badge from "../../../shared/ui/Badge";
import UserStatusFooter from "./UserStatusFooter";
import RecommendedPeople from "./RecommendedPeople";
import RecommendedServers from "./RecommendedServers";
import { useNavigate } from "react-router-dom";
import { AppRoute } from "../../../shared/constants/app-route.const";
import { useUserSettings } from "../../settings/hooks/useUserSettings";

export default function NavSidebar() {
  const navigate = useNavigate();
  const { data: settings, isLoading: isLoadingSettings } = useUserSettings();

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
      <div className="flex-1 py-4 px-2 space-y-4 overflow-y-auto no-scrollbar">
        <div className="space-y-0.5">
          {mainItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Friends") {
                  navigate(AppRoute.HOME_PAGE);
                }
              }}
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

        {isLoadingSettings && (
          <>
            <hr className="border-white/5 mx-2" />
            <div className="px-3 space-y-4 mt-4">
              <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-12 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-12 bg-white/5 rounded-lg animate-pulse" />
              </div>
            </div>
          </>
        )}

        {!isLoadingSettings && settings?.showRecommendations && (
          <>
            {settings.allowFriendRecommendations && (
              <>
                <hr className="border-white/5 mx-2" />
                <div className="space-y-2">
                  <h2 className="px-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">
                    Recommended People
                  </h2>
                  <RecommendedPeople enabled={settings.showRecommendations && settings.allowFriendRecommendations} />
                </div>
              </>
            )}

            {settings.allowServerRecommendations && (
              <>
                <hr className="border-white/5 mx-2" />
                <div className="space-y-2 pb-4">
                  <h2 className="px-3 text-[11px] font-bold text-white/30 uppercase tracking-wider">
                    Recommended Servers
                  </h2>
                  <RecommendedServers enabled={settings.showRecommendations && settings.allowServerRecommendations} />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* User Status Footer */}
      <UserStatusFooter />
    </aside>
  );
}
