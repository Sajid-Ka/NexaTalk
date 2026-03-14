import { Verified } from "lucide-react";
import Avatar from "../../../shared/ui/Avatar";
import Badge from "../../../shared/ui/Badge";
import { BadgeVariant } from "../../../shared/constants/ui.const";

interface ProfileCardPreviewProps {
    username: string;
    bio: string;
    avatarUrl?: string;
    showOnlineStatus: boolean;
}

export default function ProfileCardPreview({
    username,
    bio,
    avatarUrl,
    showOnlineStatus
}: ProfileCardPreviewProps) {
    return (
        <div className="w-[340px] sticky top-0">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">
                PROFILE CARD PREVIEW
            </h3>

            <div className="bg-[#090B11] rounded-3xl overflow-hidden shadow-2xl border border-white/5 group hover:border-indigo-500/30 transition-colors duration-500">
                {/* Banner */}
                <div className="h-24 bg-gradient-to-br from-indigo-900 via-[#1A1D2D] to-purple-900 relative">
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="px-5 pb-6 -mt-10 relative">
                    {/* Avatar */}
                    <div className="relative inline-block mb-4">
                        <div className="p-1.5 bg-[#090B11] rounded-[28px]">
                            <Avatar
                                src={avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"}
                                fallback={username[0] || "U"}
                                size="xl"
                                className="rounded-[22px] border-2 border-indigo-500/20"
                            />
                        </div>
                        {showOnlineStatus && (
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-500 rounded-full border-4 border-[#090B11]" />
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-start justify-between mb-1">
                        <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="text-xl font-bold text-white">{username || "User"}</h4>
                                <Verified size={18} className="text-indigo-400 fill-indigo-400/20" />
                            </div>
                            <p className="text-xs text-white/40 font-medium lowercase">
                                @{username?.toLowerCase() || "user"}
                            </p>
                        </div>
                        <Badge variant={BadgeVariant.INDIGO} className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[10px] py-0.5 px-2">
                            <div className="w-1 h-1 rounded-full bg-indigo-400 mr-1.5" />
                            PRO
                        </Badge>
                    </div>

                    {/* Status Text Area */}
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Online</span>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-xs text-white/70 leading-relaxed font-medium">
                                {bio || "No bio yet..."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-[10px] text-center text-white/20 font-medium">
                Real-time preview of how your profile appears to others in rooms and lists.
            </p>
        </div>
    );
}
