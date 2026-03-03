import { useState } from "react";
import { Search, UserPlus, SlidersHorizontal, UserCheck, UserMinus } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import UserTable from "../components/UserTable";
import type { User } from "../components/UserTable";
import UserDetailSidebar from "../components/UserDetailSidebar";
import Input from "../../../shared/ui/Input";
import Button from "../../../shared/ui/Button";
import { cn } from "../../../shared/utils/cn";

const MOCK_USERS: User[] = [
    {
        id: "1",
        username: "Luna_Cyber",
        email: "luna@nexatalk.io",
        role: "User",
        status: "Online",
        joinedDate: "Oct 24, 2023",
        isPro: true,
        initials: "LC",
        avatarColor: "bg-purple-600"
    },
    {
        id: "2",
        username: "Neo_Matrix",
        email: "neo@matrix.net",
        role: "Admin",
        status: "Offline",
        joinedDate: "Sep 12, 2023",
        isPro: false,
        initials: "NM",
        avatarColor: "bg-gray-600"
    },
    {
        id: "3",
        username: "Sarah_V",
        email: "sarah.v@gmail.com",
        role: "User",
        status: "Online",
        joinedDate: "Jan 05, 2024",
        isPro: false,
        initials: "SV",
        avatarColor: "bg-teal-600"
    },
    {
        id: "4",
        username: "Kai_99",
        email: "kai.stream@live.tv",
        role: "User",
        status: "Idle",
        joinedDate: "Dec 12, 2023",
        isPro: false,
        isReported: true,
        initials: "K9",
        avatarColor: "bg-amber-600"
    }
];

export default function UserManagementPage() {
    const [selectedUser, setSelectedUser] = useState<User | null>(MOCK_USERS[0]);
    const [activeTab, setActiveTab] = useState<"active" | "blocked">("active");
    const [searchQuery, setSearchQuery] = useState("");

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
                            users={MOCK_USERS}
                            selectedUserId={selectedUser?.id}
                            onSelectUser={setSelectedUser}
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
