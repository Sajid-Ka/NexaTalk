import { cn } from "../../../../shared/utils/cn";

interface ActivityItemProps {
    user: string;
    action: string;
    target?: string;
    time: string;
    type: "server" | "stream" | "signup";
}

const ActivityItem = ({ user, action, target, time, type }: ActivityItemProps) => {
    const iconColor = {
        server: "bg-emerald-500/10 text-emerald-500",
        stream: "bg-rose-500/10 text-rose-500",
        signup: "bg-sky-500/10 text-sky-500",
    }[type];

    return (
        <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-4 rounded-xl group cursor-pointer">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white/5 group-hover:ring-indigo-500/30 transition-all", iconColor)}>
                {user.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                    <span className="font-bold">{user}</span> {action} {target && <span className="text-indigo-400">"{target}"</span>}
                </p>
            </div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{time}</span>
        </div>
    );
};

export default function ActivityList() {
    return (
        <div className="bg-[#151926]/50 border border-white/5 rounded-2xl flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Platform Activity</h3>
                <button className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">View All Logs</button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ActivityItem
                    user="Ethan_Dev"
                    action="created a new server"
                    target="Cyber Punk Fans"
                    time="2m ago"
                    type="server"
                />
                <ActivityItem
                    user="Mia_Nexa"
                    action="started streaming"
                    target="Valorant Ranked"
                    time="5m ago"
                    type="stream"
                />
                <ActivityItem
                    user="User_9921"
                    action="Joined the platform"
                    time="12m ago"
                    type="signup"
                />
            </div>
        </div>
    );
}
