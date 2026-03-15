import { useEffect, useState } from "react";
import { Search, UserCheck, UserMinus } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import UserTable from "../components/UserTable";
import type { User } from "../components/UserTable";
import UserDetailSidebar from "../components/UserDetailSidebar";
import Input from "../../../shared/ui/Input";
import { cn } from "../../../shared/utils/cn";
import { 
    getUsersApi, 
    getUserDetailsApi, 
    blockUserApi, 
    unblockUserApi, 
    deleteUserApi,
    forceLogoutUserApi 
} from "../api/adminApi";
import { UserRole, UserStatus, UserTab } from "../../../shared/constants/user.const";
import toast from "react-hot-toast";
import axios from "axios";

interface ApiUser {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<UserTab>(UserTab.ACTIVE);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState<string>("joinedDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsersApi({
                    status: activeTab,
                    search: debouncedSearch,
                });

                const mappedUsers = (res.data.data?.users ?? []).map((u: ApiUser) => ({
                    id: u.id,
                    username: u.username,
                    email: u.email,
                    role: u.role === UserRole.ADMIN ? "Admin" : "User",
                    status: u.status === UserStatus.ACTIVE ? "Online" : "Offline",
                    joinedDate: new Date(u.createdAt).toLocaleDateString(),
                    initials: u.username.slice(0, 2).toUpperCase(),
                }));

                setUsers(mappedUsers);
            } catch (error) {
                console.error("Failed to fetch users", error);
                toast.error("Failed to load users");
            }
        };

        fetchUsers();
    }, [activeTab, debouncedSearch]);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
    };

    const handleSelectUser = async (user: User) => {
        try {
            const res = await getUserDetailsApi(user.id);
            const userData = res.data.data;

            const mappedUser: User = {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role === "admin" ? "Admin" : "User",
                status: userData.status === "active" ? "Online" : "Offline",
                joinedDate: new Date(userData.createdAt).toLocaleDateString(),
                initials: userData.username.slice(0, 2).toUpperCase(),
            };

            setSelectedUser(mappedUser);
        } catch (error) {
            console.error("Failed to load user details", error);
            toast.error("Failed to load user details");
        }
    };

    const handleBlockUser = async (userId: string) => {
        try {
            await blockUserApi(userId);
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, status: "Offline" } : u
            ));
            if (selectedUser?.id === userId) {
                setSelectedUser(prev => prev ? { ...prev, status: "Offline" } : null);
            }
            toast.success("User blocked successfully");
        } catch (error: unknown) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || "Failed to block user";
                toast.error(message);
            }else {
                toast.error("An undexpected error occurred");
            }
        }
    };

    const handleUnblockUser = async (userId: string) => {
        try {
            await unblockUserApi(userId);
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, status: "Online" } : u
            ));
            if (selectedUser?.id === userId) {
                setSelectedUser(prev => prev ? { ...prev, status: "Online" } : null);
            }
            toast.success("User unblocked successfully");
        } catch (error: unknown) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || "Failed to unblock user";
                toast.error(message);
            } else {
                toast.error("An unexpected error occurred");
            }
            
        }
    };

    const handleForceLogout = async (userId: string) => {
        try {
            await forceLogoutUserApi(userId);
            toast.success("User logged out successfully");
        } catch (error: unknown) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || "Failed to force logout";
                toast.error(message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUserApi(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
            if (selectedUser?.id === userId) {
                setSelectedUser(null);
            }
            toast.success("User deleted successfully");
        } catch (error: unknown) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.message || "Failed to delete user";
                toast.error(message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0F121D] text-white overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 flex flex-col bg-[#0A0C14] overflow-hidden">
                <header className="px-8 py-6 border-b border-white/5 bg-[#0F121D]/50 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black">User Management</h1>
                        <p className="text-xs text-gray-500">Manage access, roles, and status</p>
                    </div>
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                            placeholder="Search username or email..."
                            className="bg-[#0F121D]/50 border-white/5 pl-12 h-11"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto">
                        <div className="flex items-center gap-2 p-1 bg-[#0F121D] rounded-xl border border-white/5 w-fit">
                            <button
                                onClick={() => setActiveTab(UserTab.ACTIVE)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all",
                                    activeTab === UserTab.ACTIVE 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                                        : "text-gray-500 hover:text-white"
                                )}
                            >
                                <UserCheck size={16} />
                                Active Users
                            </button>
                            <button
                                onClick={() => setActiveTab(UserTab.BLOCKED)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all",
                                    activeTab === UserTab.BLOCKED 
                                        ? "bg-red-600 text-white shadow-lg shadow-red-500/30" 
                                        : "text-gray-500 hover:text-white"
                                )}
                            >
                                <UserMinus size={16} />
                                Blocked Users
                            </button>
                        </div>

                        <UserTable
                            users={users}
                            selectedUserId={selectedUser?.id}
                            onSelectUser={handleSelectUser}
                            onBlockUser={handleBlockUser}
                            onUnblockUser={handleUnblockUser}
                            onForceLogout={handleForceLogout}
                            onDeleteUser={handleDeleteUser}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                        />
                    </div>

                    <aside className="w-[320px] bg-[#0F121D] border-l border-white/5 overflow-y-auto hidden xl:block">
                        <UserDetailSidebar user={selectedUser} />
                    </aside>
                </div>
            </main>
        </div>
    );
}