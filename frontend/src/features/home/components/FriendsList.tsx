import { Users, Search, MessageSquare, Phone, MoreVertical } from "lucide-react";
import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";
import { cn } from "../../../shared/utils/cn";
import type { FriendStatus } from "../types/friend.types";

export default function FriendsList() {
    const tabs = ["Online", "All", "Pending", "Blocked"];
    const currentTab = "Online";

    const friends = [
        { name: "Luna_Cyber", status: "online", activity: "Playing Starfield", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna", streaming: true },
        { name: "Dexter_01", status: "idle", activity: "Code, eat, sleep, repeat...", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dexter" },
        { name: "SarahVox", status: "online", activity: "Available for voice chat!", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
    ];

    const offlineFriends = [
        { name: "Ghost_Runner", status: "offline", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ghost" },
        { name: "Void_Seeker", status: "offline", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Void" },
    ];

    return (
        <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header */}
            <header className="h-12 px-4 flex items-center justify-between border-b border-white/5 bg-[#0F121D]/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/50 border-r border-white/10 pr-4">
                        <Users size={20} />
                        <span className="font-bold text-sm text-white">Friends</span>
                    </div>

                    <nav className="flex items-center gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={cn(
                                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                                    tab === currentTab
                                        ? "bg-white/10 text-white"
                                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <Button size="sm" className="bg-indigo-600 rounded-lg text-xs h-8 px-4 border-none font-bold">Add Friend</Button>
            </header>

            {/* Search Bar */}
            <div className="px-6 pt-6 pb-2">
                <div className="relative group">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Find a friend..."
                        className="w-full bg-[#0F121D] border border-white/5 rounded-xl h-10 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10"
                    />
                </div>
            </div>

            {/* Friend List Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4">
                {/* Online Section */}
                <div className="mb-8">
                    <h3 className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Online — {friends.length}</h3>
                    <div className="space-y-1">
                        {friends.map((friend) => (
                            <div key={friend.name} className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <Avatar src={friend.avatar} fallback={friend.name} status={friend.status as FriendStatus} size="md" />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm text-white">{friend.name}</p>
                                            {friend.streaming && (
                                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-indigo-600/20 text-indigo-400 border border-indigo-500/10 uppercase tracking-tighter">Streaming</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/40 truncate italic">{friend.activity}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2.5 rounded-full bg-[#090B11] text-white/50 hover:text-indigo-400 transition-colors">
                                        <MessageSquare size={18} />
                                    </button>
                                    <button className="p-2.5 rounded-full bg-[#090B11] text-white/50 hover:text-indigo-400 transition-colors">
                                        <Phone size={18} />
                                    </button>
                                    <button className="p-2.5 rounded-full bg-[#090B11] text-white/50 hover:text-indigo-400 transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Offline Section */}
                <div>
                    <h3 className="px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Offline — 12</h3>
                    <div className="space-y-1">
                        {offlineFriends.map((friend) => (
                            <div key={friend.name} className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer opacity-50 hover:opacity-100">
                                <Avatar fallback={friend.name} size="md" src={friend.avatar} className="grayscale" />
                                <p className="font-bold text-sm text-white/60 group-hover:text-white transition-colors">{friend.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
