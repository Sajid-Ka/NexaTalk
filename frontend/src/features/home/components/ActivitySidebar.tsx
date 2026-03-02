import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";
import { Volume2, Play } from "lucide-react";

export default function ActivitySidebar() {
    return (
        <aside className="w-[340px] hidden xl:flex flex-col bg-[#090B11] p-4 shrink-0 border-l border-white/5 overflow-y-auto no-scrollbar">
            <h2 className="text-xl font-bold mb-4">Active Now</h2>

            {/* Activity Card */}
            <div className="bg-[#151926] rounded-2xl p-4 mb-4 border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luna" fallback="LC" status="online" size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Luna_Cyber</p>
                        <p className="text-xs text-white/40 truncate">Starfield: Space Walk</p>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </div>

                {/* Activity Image Placeholder */}
                <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 mb-4 flex items-center justify-center overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=400" alt="Activity" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <Play size={24} className="fill-white text-white translate-x-0.5" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                        <Avatar size="xs" fallback="A" className="ring-2 ring-[#151926]" src="https://api.dicebear.com/7.x/avataaars/svg?seed=User1" />
                        <Avatar size="xs" fallback="K" className="ring-2 ring-[#151926]" src="https://api.dicebear.com/7.x/avataaars/svg?seed=User2" />
                        <div className="h-6 w-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-[10px] font-bold ring-2 ring-[#151926] text-indigo-400">+12</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40">2.4k viewers</span>
                        <Button size="sm" className="h-7 text-[10px] rounded-lg bg-indigo-600 hover:bg-indigo-550 border-none px-4">Join</Button>
                    </div>
                </div>
            </div>

            {/* Voice Channels */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">In Voice</h3>
                    <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">Join</button>
                </div>
                <div className="space-y-4">
                    <div className="bg-indigo-600/5 rounded-2xl p-4 border border-indigo-500/10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400">
                                    <Volume2 size={16} />
                                </div>
                                <span className="text-sm font-bold">General Gaming</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300">Join</Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5">
                                <Avatar size="xs" fallback="D" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Dexter" />
                                <span className="text-[10px] font-medium text-white/70">Dexter</span>
                            </div>
                            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5">
                                <Avatar size="xs" fallback="R" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rook" />
                                <span className="text-[10px] font-medium text-white/70">Rook</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Card */}
            <div className="mt-auto pt-6">
                <div className="relative rounded-2xl p-5 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-800" />
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-1">Go Unlimited</h3>
                        <p className="text-[10px] text-white/70 mb-6 leading-relaxed">
                            Boost your server and unlock 4K streaming quality.
                        </p>
                        <Button className="w-full bg-white text-indigo-700 hover:bg-slate-100 font-bold text-xs h-10 border-none shadow-xl">
                            UPGRADE NOW
                        </Button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
