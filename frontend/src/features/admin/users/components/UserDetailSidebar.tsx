import type { User } from "./UserTable";
import Avatar from "../../../../shared/ui/Avatar";


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
                    <span className={`text-sm font-medium ${user.status === "Online" ? "text-green-500" : "text-gray-500"
                        }`}>
                        {user.status}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Joined</span>
                    <span className="text-sm text-white font-medium">{user.joinedDate}</span>
                </div>
            </div>
        </div>
    );
}
