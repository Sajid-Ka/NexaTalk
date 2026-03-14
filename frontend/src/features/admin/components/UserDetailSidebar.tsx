import { Mail, RefreshCw } from "lucide-react";
import type { User } from "./UserTable";
import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";

interface UserDetailSidebarProps {
    user: User | null;
}

export default function UserDetailSidebar({ user }: UserDetailSidebarProps) {
    if (!user) {
        return (
            <div className="w-[300px] h-full flex items-center justify-center text-gray-500 text-sm italic">
                Select a user to view details
            </div>
        );
    }

    const shortUid = user.id.slice(-6).toUpperCase();

    return (
        <div className="w-[320px] h-full flex flex-col gap-8 p-6 animate-in slide-in-from-right duration-300">
            {/* User Profile Info */}
            <div className="flex flex-col items-center text-center space-y-4">
                <Avatar
                    fallback={user.initials}
                    size="xl"
                />
                <div className="space-y-1">
                    <h2 className="text-xl font-black">{user.username}</h2>
                    <p className="text-xs text-gray-500 font-medium">{user.role}</p>
                    <p className="text-xs text-gray-500 font-mono">ID: {shortUid}</p>
                </div>
            </div>

            {/* User Details */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-gray-500 font-medium">Email</span>
                    <span className="text-sm text-white font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs text-gray-500 font-medium">Status</span>
                    <span className={`text-sm font-medium ${
                        user.status === "Online" ? "text-green-500" : "text-gray-500"
                    }`}>
                        {user.status}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Joined</span>
                    <span className="text-sm text-white font-medium">{user.joinedDate}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full justify-center gap-2 bg-indigo-500/5 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10">
                    <Mail size={16} />
                    Message User
                </Button>
                <Button variant="outline" className="w-full justify-center gap-2 text-gray-400 hover:text-white">
                    <RefreshCw size={16} />
                    Reset Password
                </Button>
            </div>

            {/* Activity Log */}
            {/* <div className="mt-auto space-y-4">
                <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Recent Activity Log</h3>
                <div className="space-y-4 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
                    <div className="flex gap-4 relative">
                        <div className="w-3 h-3 rounded-full bg-green-500 mt-1 z-10" />
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-500 font-medium">2 mins ago</p>
                            <p className="text-xs font-bold">Logged in from US-West</p>
                        </div>
                    </div>
                    <div className="flex gap-4 relative">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 z-10" />
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-500 font-medium">1 day ago</p>
                            <p className="text-xs font-bold">Upgraded to Pro Plan</p>
                        </div>
                    </div>
                    <div className="flex gap-4 relative">
                        <div className="w-3 h-3 rounded-full bg-gray-600 mt-1 z-10" />
                        <div className="space-y-0.5">
                            <p className="text-[10px] text-gray-500 font-medium">3 days ago</p>
                            <p className="text-xs font-bold">Changed password</p>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    );
}
