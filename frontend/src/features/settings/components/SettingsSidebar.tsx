import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/context/useAuth";
import {
    User,
    Shield,
    Volume2,
    MessageSquare,
    Bell,
    Radio,
    DollarSign,
    Star,
    LogOut,
    ArrowLeft
} from "lucide-react";
import { cn } from "../../../shared/utils/cn";

const sidebarItems = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "account", label: "Account & Security", icon: Shield },
    { id: "voice", label: "Voice & Video", icon: Volume2 },
    { id: "chat", label: "Chat Settings", icon: MessageSquare },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "streaming", label: "Streaming Settings", icon: Radio },
    { id: "monetization", label: "Monetization & Earnings", icon: DollarSign },
    { id: "interests", label: "Interests", icon: Star },
];

export default function SettingsSidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            navigate("/login", { replace: true });
        }
    }

    const location = useLocation();
    const activeItem = location.pathname.split("/").pop() || "profile";

    return (
        <aside className="w-[280px] h-screen bg-[#090B11] border-r border-white/5 flex flex-col shrink-0">
            {/* Back to Home */}
            <div className="p-6 pb-4">
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center gap-3 text-[#00E5FF] hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                        <ArrowLeft size={18} />
                    </div>
                    <span className="font-semibold text-sm">Back to Home</span>
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(`/settings/${item.id}`)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            activeItem === item.id
                                ? "bg-indigo-600/10 text-white"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <item.icon size={20} className={cn(
                            activeItem === item.id ? "text-indigo-500" : "group-hover:text-white"
                        )} />
                        <span className="text-sm font-medium">{item.label}</span>
                        {activeItem === item.id && (
                            <div className="ml-auto w-1 h-4 bg-indigo-500 rounded-full" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Log Out */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Log Out</span>
                </button>
            </div>
        </aside>
    );
}
