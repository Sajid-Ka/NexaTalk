import { useEffect, useState } from "react";
import { UserCheck, UserMinus } from "lucide-react";

import AdminSidebar from "../../shared/components/AdminSidebar";

import UserTable from "../components/UserTable";
import UserDetailSidebar from "../components/UserDetailSidebar";
import type { User } from "../type/userManagement.types";

import {
  getUsersApi,
  getUserDetailsApi,
  blockUserApi,
  unblockUserApi,
  deleteUserApi,
  forceLogoutUserApi,
} from "../api/userManagementApi";

import {
  AdminUserSortOrder,
  UserPresence,
  UserRole,
  UserStatus,
  UserTab,
} from "../../../../shared/constants/user.const";

import toast from "react-hot-toast";
import axios from "axios";

import { cn } from "../../../../shared/utils/cn";

import ManagementPageHeader from "../../../../shared/ui/management/ManagementPageHeader";
import ManagementToolbar from "../../../../shared/ui/management/ManagementToolbar";
import ManagementSearch from "../../../../shared/ui/management/ManagementSearch";
import ManagementCard from "../../../../shared/ui/management/ManagementCard";

interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  presenceStatus?: UserPresence;
  createdAt: string;
}

const getPresenceLabel = (presenceStatus?: UserPresence) =>
  presenceStatus === UserPresence.ONLINE ? "Online" : "Offline";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [activeTab, setActiveTab] = useState<UserTab>(
    UserTab.ACTIVE
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sortBy, setSortBy] =
    useState<string>("joinedDate");

  const [sortOrder, setSortOrder] =
    useState<AdminUserSortOrder>(AdminUserSortOrder.DESC);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchQuery),
      400
    );

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersApi({
          status: activeTab,
          search: debouncedSearch,
        });

        const mappedUsers = (
          res.data.data?.users ?? []
        ).map((u: ApiUser) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          role:
            u.role === UserRole.ADMIN
              ? "Admin"
              : "User",
          status: getPresenceLabel(u.presenceStatus),
          accountStatus: u.status,
          joinedDate: new Date(
            u.createdAt
          ).toLocaleDateString(),
          initials: u.username
            .slice(0, 2)
            .toUpperCase(),
        }));

        setUsers(mappedUsers);
      } catch (error) {
        console.error(
          "Failed to fetch users",
          error
        );

        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, [activeTab, debouncedSearch]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(
        sortOrder === AdminUserSortOrder.ASC ? AdminUserSortOrder.DESC : AdminUserSortOrder.ASC
      );
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleSelectUser = async (
    user: User
  ) => {
    try {
      const res = await getUserDetailsApi(user.id);

      const userData = res.data.data;

      const mappedUser: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role:
          userData.role === "admin"
            ? "Admin"
            : "User",
        status: getPresenceLabel(userData.presenceStatus),
        accountStatus: userData.status,
        joinedDate: new Date(
          userData.createdAt
        ).toLocaleDateString(),
        initials: userData.username
          .slice(0, 2)
          .toUpperCase(),
      };

      setSelectedUser(mappedUser);
    } catch (error) {
      console.error(
        "Failed to load user details",
        error
      );

      toast.error(
        "Failed to load user details"
      );
    }
  };

  const handleBlockUser = async (
    userId: string
  ) => {
    try {
      await blockUserApi(userId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, accountStatus: UserStatus.BLOCKED, status: "Offline" }
            : u
        )
      );

      if (selectedUser?.id === userId) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                accountStatus: UserStatus.BLOCKED,
                status: "Offline",
              }
            : null
        );
      }

      toast.success(
        "User blocked successfully"
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to block user";

        toast.error(message);
      } else {
        toast.error(
          "An unexpected error occurred"
        );
      }
    }
  };

  const handleUnblockUser = async (
    userId: string
  ) => {
    try {
      await unblockUserApi(userId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, accountStatus: UserStatus.ACTIVE }
            : u
        )
      );

      if (selectedUser?.id === userId) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                accountStatus: UserStatus.ACTIVE,
              }
            : null
        );
      }

      toast.success(
        "User unblocked successfully"
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to unblock user";

        toast.error(message);
      } else {
        toast.error(
          "An unexpected error occurred"
        );
      }
    }
  };

  const handleForceLogout = async (
    userId: string
  ) => {
    try {
      await forceLogoutUserApi(userId);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: "Offline" }
            : u
        )
      );

      if (selectedUser?.id === userId) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                status: "Offline",
              }
            : null
        );
      }

      toast.success(
        "User logged out successfully"
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to force logout";

        toast.error(message);
      } else {
        toast.error(
          "An unexpected error occurred"
        );
      }
    }
  };

  const handleDeleteUser = async (
    userId: string
  ) => {
    try {
      await deleteUserApi(userId);

      setUsers((prev) =>
        prev.filter((u) => u.id !== userId)
      );

      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }

      toast.success(
        "User deleted successfully"
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to delete user";

        toast.error(message);
      } else {
        toast.error(
          "An unexpected error occurred"
        );
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F121D] text-white">
      <AdminSidebar />

      <main className="flex flex-1 flex-col overflow-hidden bg-[#0A0C14]">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 p-8">
            <ManagementPageHeader
              title="User Management"
              description="Manage platform users, access, permissions and moderation actions."
            />

            <ManagementToolbar>
              <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#0F121D] p-1">
                <button
                  onClick={() =>
                    setActiveTab(UserTab.ACTIVE)
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-6 py-2 text-xs font-bold transition-all",
                    activeTab === UserTab.ACTIVE
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-gray-500 hover:text-white"
                  )}
                >
                  <UserCheck size={16} />
                  Active Users
                </button>

                <button
                  onClick={() =>
                    setActiveTab(UserTab.BLOCKED)
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-6 py-2 text-xs font-bold transition-all",
                    activeTab === UserTab.BLOCKED
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                      : "text-gray-500 hover:text-white"
                  )}
                >
                  <UserMinus size={16} />
                  Blocked Users
                </button>
              </div>

              <ManagementSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search username or email..."
              />
            </ManagementToolbar>

            <div className="flex gap-6">
              <div className="min-w-0 flex-1">
                <ManagementCard>
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
                </ManagementCard>
              </div>

              <aside className="hidden w-[360px] xl:block">
                <ManagementCard>
                  <UserDetailSidebar
                    user={selectedUser}
                  />
                </ManagementCard>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
