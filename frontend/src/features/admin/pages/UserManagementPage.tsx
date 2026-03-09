import { useEffect, useState } from "react";
import { Search, UserPlus, SlidersHorizontal, UserCheck, UserMinus } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import UserTable from "../components/UserTable";
import type { User } from "../components/UserTable";
import UserDetailSidebar from "../components/UserDetailSidebar";
import Input from "../../../shared/ui/Input";
import Button from "../../../shared/ui/Button";
import { cn } from "../../../shared/utils/cn";
import { getUserDetailsApi, getUsersApi } from "../api/adminApi";


export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState<"active" | "blocked">("active");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        },400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const fetchUsers = async () => {
            try{
                const res = await getUsersApi({
                    status : activeTab,
                    search : debouncedSearch,
                });

                const mappedUsers = (res.data.data?.users ?? []).map((u : any) => ({
                    id : u.id,
                    username : u.username,
                    email : u.email,
                    role : u.role === "admin" ? "Admin" : "User",
                    status : u.status,
                    joinedDate : new Date(u.createdAt).toLocaleDateString(),
                    initials : u.username.slice(0,2).toUpperCase(),
                    isPro : false,
                }));

                setUsers(mappedUsers)
            }catch (error) {
                console.error("failed to fetch users",error);
            }
        };

        fetchUsers();
    }, [activeTab, searchQuery])

    const handleSelectUser = async (user : User) => {
        try {
            const res = await getUserDetailsApi(user.id);
            setSelectedUser(res.data.data);
        } catch (error) {
            console.error("failed to load user details",error);
        }

    }

    return (
        <div className="flex h-screen w-full bg-[#0F121D] text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0A0C14] overflow-hidden">
                {/* Header */}
                <header className="px-8 py-6 border-b border-white/5 bg-[#0F121D]/50 backdrop-blur-md flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight">User Management</h1>
                        <p className="text-xs text-gray-500 font-medium">Manage access, roles, and status</p>
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
                    {/* User List Section */}
                    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto">
                        {/* Filters and Tabs */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 p-1 bg-[#0F121D] rounded-xl border border-white/5 w-fit">
                                <button
                                    onClick={() => setActiveTab("active")}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all",
                                        activeTab === "active" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <UserCheck size={16} />
                                    Active Users
                                </button>
                                <button
                                    onClick={() => setActiveTab("blocked")}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all",
                                        activeTab === "blocked" ? "bg-red-600 text-white shadow-lg shadow-red-500/30" : "text-gray-500 hover:text-white"
                                    )}
                                >
                                    <UserMinus size={16} />
                                    Blocked Users
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="h-10 text-xs gap-2 border-white/5">
                                    <SlidersHorizontal size={14} />
                                    Filters
                                </Button>
                                <Button variant="primary" className="h-10 text-xs gap-2">
                                    <UserPlus size={16} />
                                    Add New User
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <UserTable
                            users={users}
                            selectedUserId={selectedUser?.id}
                            onSelectUser={handleSelectUser}
                        />
                    </div>

                    {/* Right Info Sidebar */}
                    <aside className="w-[320px] bg-[#0F121D] border-l border-white/5 overflow-y-auto hidden xl:block">
                        <UserDetailSidebar user={selectedUser} />
                    </aside>
                </div>
            </main>
        </div>
    );
}
