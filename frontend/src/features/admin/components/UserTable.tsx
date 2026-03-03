import { Eye, Ban, LogOut, Trash2 } from "lucide-react";
import Avatar from "../../../shared/ui/Avatar";
import Badge from "../../../shared/ui/Badge";
import { cn } from "../../../shared/utils/cn";

export interface User {
    id: string;
    username: string;
    email: string;
    role: "Admin" | "User" | "Creator";
    status: "Online" | "Offline" | "Idle";
    joinedDate: string;
    isPro: boolean;
    isReported?: boolean;
    initials: string;
    avatarColor?: string;
}

interface UserTableProps {
    users: User[];
    selectedUserId?: string;
    onSelectUser: (user: User) => void;
}

export default function UserTable({ users, selectedUserId, onSelectUser }: UserTableProps) {
    return (
        <div className="w-full overflow-hidden rounded-2xl bg-[#0F121D]/50 border border-white/5">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            onClick={() => onSelectUser(user)}
                            className={cn(
                                "group cursor-pointer transition-colors hover:bg-white/[0.02]",
                                selectedUserId === user.id && "bg-white/[0.04]"
                            )}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        fallback={user.initials}
                                        size="sm"
                                        className={cn("ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all", user.avatarColor)}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white leading-tight">{user.username}</span>
                                        {user.isPro && (
                                            <span className="text-[10px] text-indigo-400 font-medium">Pro Member</span>
                                        )}
                                        {user.isReported && (
                                            <span className="text-[10px] text-amber-500 font-medium">Reported</span>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs text-gray-400 font-medium">{user.email}</span>
                            </td>
                            <td className="px-6 py-4">
                                <Badge
                                    variant={user.role === "Admin" ? "indigo" : "secondary"}
                                    className={cn(
                                        "capitalize px-3 py-1",
                                        user.role === "Admin" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/20" : "bg-white/5 text-gray-400"
                                    )}
                                >
                                    {user.role}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "w-1.5 h-1.5 rounded-full",
                                        user.status === "Online" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
                                            user.status === "Idle" ? "bg-amber-500" : "bg-gray-500"
                                    )} />
                                    <span className="text-xs text-gray-300 font-medium">{user.status}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs text-gray-400 font-medium">{user.joinedDate}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                                        <Eye size={16} />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                                        <Ban size={16} />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                                        <LogOut size={16} />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
