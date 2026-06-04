import { useEffect, useState } from "react";
import { Plus, Compass } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { cn } from "../../../shared/utils/cn";
import ServerIcon from "../../../shared/ui/ServerIcon";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { fetchUserServers, setCurrentServer } from "../../servers/core/store/serverSlice";
import CreateServerModal from "../../servers/core/components/CreateServerModal";
import JoinServerModal from "../../servers/core/components/JoinServerModal";
import type { Server } from "../../servers/core/types";



export default function ServerSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { serverId } = useParams();
    const dispatch = useAppDispatch();
    const { userServers, loading } = useAppSelector((state) => state.servers);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchUserServers());
    }, [dispatch]);

    const handleServerClick = (server: Server) => {
        if(server.id === serverId){
            //if user click same server icon in inside the server then nothing happen
            return;
        }
        dispatch(setCurrentServer(server));
        navigate(`/servers/${server.id}`);
    };

    const isHomeActive = !serverId && (location.pathname === "/" || location.pathname === "/home");
    const isCreateActive = isCreateModalOpen;
    const isJoinActive = isJoinModalOpen;



    return (
        <aside className="w-[72px] flex flex-col items-center py-3 bg-[#090B11] border-r border-white/5 shrink-0 h-full">
            {/* Home Button */}
            <div className="relative mb-4 mt-2">
                <button
                    onClick={() => navigate("/")}
                    className={cn(
                        "relative h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300",
                        isHomeActive
                            ? "bg-[#0B1020] ring-2 ring-violet-500 ring-offset-2 ring-offset-[#090B11] shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                            : "bg-transparent hover:bg-violet-600/10 hover:ring-2 hover:ring-violet-500/50 hover:ring-offset-2 hover:ring-offset-[#090B11]"
                    )}
                >
                    <img
                        src="/Stylized N with speech bubble.png"
                        alt="NexaTalk Home"
                        className="w-10 h-10 object-contain"
                    />
                </button>
            </div>

            <div className="w-8 h-[2px] bg-white/10 rounded-full mb-6" />

            {/* Server List */}
                        {/* Server List */}
            <div className="flex-1 w-full flex flex-col items-center gap-4 py-2 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-h-0">
                {userServers.map((server) => (
                    <ServerIcon
                        key={server.id}
                        name={server.name}
                        icon={server.icon}
                        active={serverId === server.id}
                        onClick={() => handleServerClick(server)}
                    />
                ))}
                {loading && userServers.length === 0 && (
                    <div className="h-12 w-12 rounded-full border-2 border-dashed border-white/10 animate-spin" />
                )}
            </div>
            {/* Bottom Sticky Buttons */}
            <div className="flex flex-col items-center gap-4 pt-2 w-full shrink-0">
                {/* Create Server Button */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className={cn(
                        "relative h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 group",
                        isCreateActive
                            ? "bg-[#0B1020] text-white ring-2 ring-violet-500 ring-offset-2 ring-offset-[#090B11] shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                            : "bg-white/5 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:ring-2 hover:ring-violet-500/50 hover:ring-offset-2 hover:ring-offset-[#090B11]"
                    )}
                >
                    <Plus size={24} />
                </button>
                {/* Join Server Button */}
                <button
                    onClick={() => setIsJoinModalOpen(true)}
                    className={cn(
                        "relative h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 group",
                        isJoinActive
                            ? "bg-[#0B1020] text-white ring-2 ring-violet-500 ring-offset-2 ring-offset-[#090B11] shadow-[0_0_20px_rgba(139,92,246,0.6)]"
                            : "bg-white/5 text-emerald-500 hover:bg-emerald-500 hover:text-white hover:ring-2 hover:ring-violet-500/50 hover:ring-offset-2 hover:ring-offset-[#090B11]"
                    )}
                >
                    <Compass size={24} />
                </button>
                {/* AI Chat Button */}
                <button className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-violet-600 transition-all duration-300 group relative ring-offset-[#090B11] hover:ring-2 hover:ring-violet-500/50 hover:ring-offset-2">
                    <img
                        src="/Chat bubble character with neon headphones.png"
                        alt="AI"
                        className="w-15 h-15 object-contain scale-[1.7] translate-y-[2px]"
                    />
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-[#090B11] border border-white/10 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                        AI Chat
                    </div>
                </button>
            </div>



            <CreateServerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <JoinServerModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
            />
        </aside>
    );
}