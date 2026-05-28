import { type ElementType } from "react";
import {
    LayoutDashboard,
    Users,
    ShieldAlert,
    MessageSquareWarning,
    CreditCard,
    Settings,
    ClipboardList,
    Activity,
    LogOut
} from "lucide-react";
import { cn } from "../../../../shared/utils/cn";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/context/useAuth";
import toast from "react-hot-toast";
import { AppRoute } from "../../../../shared/constants/app-route.const";

interface NavItemProps {
    icon: ElementType;
    label: string;
    active?: boolean;
    badge?: number;
    onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active, badge, onClick }: NavItemProps) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 group",
            active ? "bg-gradient-to-r from-indigo-500/20 to-transparent border-l-4 border-indigo-500 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
        )}>
        <div className="flex items-center gap-3">
            <Icon size={20} className={cn(active ? "text-indigo-500" : "group-hover:text-white")} />
            <span className="text-sm font-medium">{label}</span>
        </div>
        {badge && (
            <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                {badge}
            </span>
        )}
    </div>
);

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed: ", error);
            toast.error("Failed to loggout");
        }
    }

    return (
        <aside className="w-64 h-full bg-[#0F121D] border-r border-white/5 flex flex-col py-6">
            <div className="px-6 mb-10 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-12">
                    <span className="text-white font-black text-xl -rotate-12">N</span>
                </div>
                <div>
                    <h1 className="text-sm font-bold tracking-tight">NEXATALK</h1>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-none">Admin Panel</p>
                </div>
            </div>

            <nav className="flex-1 space-y-1">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    active={location.pathname === "/admin"}
                    onClick={() => navigate("/admin")}
                />
                <NavItem
                    icon={Users}
                    label="User Management"
                    active={location.pathname === "/admin/users"}
                    onClick={() => navigate("/admin/users")}
                />
                <NavItem
                    icon={ShieldAlert}
                    label="Server Moderation"
                    active={location.pathname === AppRoute.ADMIN_SERVERS}
                    onClick={() => navigate(AppRoute.ADMIN_SERVERS)}
                />
                <NavItem icon={MessageSquareWarning} label="Reports Queue" badge={12} />
                <NavItem icon={CreditCard} label="Earnings & Pay" />
                <NavItem icon={Settings} label="Platform Settings" />
                <NavItem icon={ClipboardList} label="Audit Logs" />
                <NavItem icon={Activity} label="System Health" />
            </nav>

            <div className="px-4 mt-auto">
                <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 cursor-pointer hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </div>
            </div>
        </aside>
    );
}
