import { Verified } from "lucide-react";
import Avatar from "../../../../../shared/ui/Avatar";
import Badge from "../../../../../shared/ui/Badge";
import { BadgeVariant } from "../../../../../shared/constants/ui.const";
import { UserPresence } from "../../../../../shared/constants/user.const"; // Add this

interface ProfileCardPreviewProps {
    username: string;
    bio: string;
    avatarUrl?: string;
    showOnlineStatus: boolean;
    status?: UserPresence; // Add this - to show real status
    isPro?: boolean; // Add this - if you have pro users
    onClick?: () => void;
    compact?: boolean;
}

export default function ProfileCardPreview({
    username,
    bio,
    avatarUrl,
    showOnlineStatus,
    status = UserPresence.ONLINE, // Default to online
    isPro = false, // Default to false
    onClick,
    compact = false,
}: ProfileCardPreviewProps) {

    // Status color mapping
    const statusColors = {
        [UserPresence.ONLINE]: "bg-emerald-500",
        [UserPresence.OFFLINE]: "bg-gray-500",
    };

    const statusText = {
        [UserPresence.ONLINE]: "Online",
        [UserPresence.OFFLINE]: "Offline",
    };

    return (
        <div className={compact ? "w-[340px]" : "w-[340px] sticky top-0"}>
            {!compact && (
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
                    PROFILE CARD PREVIEW
                </h3>
            )}

            <div 
                onClick={onClick}
                className="bg-[#090B11] rounded-3xl overflow-hidden shadow-2xl border border-white/5 group hover:border-indigo-500/30 transition-colors duration-500 cursor-pointer"
            >
                {/* Banner - You can add banner later */}
                <div className="h-24 bg-gradient-to-br from-indigo-900 via-[#1A1D2D] to-purple-900 relative">
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="px-5 pb-6 -mt-10 relative">
                    <div className="relative inline-flex mb-4">
                        <Avatar
                            src={avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}
                            fallback={username[0] || "U"}
                            size="xl"
                            className="w-24 h-24 rounded-full border-4 border-[#090B11] ring-2 ring-indigo-500/20 shadow-xl"
                        />
                        {showOnlineStatus && (
                            <div className={`absolute bottom-0 right-0 w-6 h-6 ${statusColors[status]} rounded-full border-4 border-[#090B11] shadow-lg`} />
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="text-xl font-bold text-white">{username || "User"}</h4>
                                {isPro && <Verified size={18} className="text-indigo-400 fill-indigo-400/20" />}
                            </div>
                            <p className="text-xs text-white/40 font-medium lowercase">
                                @{username?.toLowerCase() || "user"}
                            </p>
                        </div>
                        {isPro && (
                            <Badge variant={BadgeVariant.INDIGO} className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] py-0.5 px-2">
                                <div className="w-1 h-1 rounded-full bg-indigo-400 mr-1.5" />
                                PRO
                            </Badge>
                        )}
                    </div>

                    {/* Status and Bio */}
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                        {showOnlineStatus && (
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
                                <span className="text-[10px] font-bold uppercase tracking-wider"
                                    style={{
                                        color: statusColors[status]
                                    }}>
                                    {statusText[status]}
                                </span>
                            </div>
                        )}

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-xs text-white/70 leading-relaxed font-medium">
                                {bio || "No bio yet..."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {!compact && (
                <p className="mt-6 text-[10px] text-center text-white/20 font-medium">
                    Real-time preview of how your profile appears to others in rooms and lists.
                </p>
            )}
        </div>
    );
}