// src/features/admin/components/UserTable.tsx
import { Eye, Ban, Unlock, Trash2 } from "lucide-react";
import { useState } from "react";
import Avatar from "../../../shared/ui/Avatar";
import Badge from "../../../shared/ui/Badge";
import { Table } from "../../../shared/ui/Table/Table";
import type { Column } from "../../../shared/ui/Table/Table";
import ConfirmModal from "../../../shared/ui/ConfirmModal";
import { useAuth } from "../../auth/context/useAuth";

export interface User {
    id: string;
    username: string;
    email: string;
    role: "Admin" | "User";
    status: "Online" | "Offline";
    joinedDate: string;
    initials: string;
}

interface UserTableProps {
    users: User[];
    selectedUserId?: string;
    onSelectUser: (user: User) => void;
    onBlockUser: (userId: string) => void;
    onUnblockUser: (userId: string) => void;
    onDeleteUser: (userId: string) => void;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onSort?: (key: string) => void;
}

export default function UserTable({ 
    users, 
    selectedUserId, 
    onSelectUser,
    onBlockUser,
    onUnblockUser,
    onDeleteUser,
    sortBy,
    sortOrder,
    onSort
}: UserTableProps) {
    const { user: currentUser } = useAuth();
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        userId: string;
        username: string;
    }>({
        isOpen: false,
        userId: "",
        username: ""
    });

    const columns: Column<User>[] = [
        {
            key: "username",
            header: "User",
            sortable: true,
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        fallback={row.initials}
                        size="sm"
                    />
                    <span className="text-sm font-bold text-white">{row.username}</span>
                </div>
            )
        },
        {
            key: "email",
            header: "Email",
            render: (email) => (
                <span className="text-xs text-gray-400">{email}</span>
            )
        },
        {
            key: "role",
            header: "Role",
            sortable: true,
            render: (role) => (
                <Badge
                    variant={role === "Admin" ? "indigo" : "secondary"}
                >
                    {role as string}
                </Badge>
            )
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            render: (status) => (
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                        status === "Online" ? "bg-green-500" : "bg-gray-500"
                    }`} />
                    <span className="text-xs text-gray-300">{status as string}</span>
                </div>
            )
        },
        {
            key: "joinedDate",
            header: "Joined",
            sortable: true,
            render: (date) => (
                <span className="text-xs text-gray-400">{date as string}</span>
            )
        },
        {
            key: "id",
            header: "Actions",
            align: "right",
            render: (_, row) => {
                const isSelf = currentUser?.id === row.id;

                return (
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectUser(row);
                            }}
                            className="p-1.5 text-gray-500 hover:text-white"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>

                        {!isSelf && (
                            row.status === "Online" ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onBlockUser(row.id);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-red-500"
                                    title="Block User"
                                >
                                    <Ban size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUnblockUser(row.id);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-green-500"
                                    title="Unblock User"
                                >
                                    <Unlock size={16} />
                                </button>
                            )
                        )}

                        {!isSelf && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteModal({
                                        isOpen: true,
                                        userId: row.id,
                                        username: row.username
                                    });
                                }}
                                className="p-1.5 text-gray-500 hover:text-red-500"
                                title="Delete User"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}

                        {isSelf && (
                            <span className="text-xs text-gray-500 italic px-2">
                                (You)
                            </span>
                        )}
                    </div>
                );
            }
        }
    ];

    const handleConfirmDelete = () => {
        onDeleteUser(deleteModal.userId);
        setDeleteModal({ isOpen: false, userId: "", username: "" });
    };

    return (
        <>
            <Table
                columns={columns}
                data={users}
                selectedRowId={selectedUserId}
                onRowClick={onSelectUser}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
                emptyMessage="No users found"
            />
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, userId: "", username: "" })}
                onConfirm={handleConfirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete user "${deleteModal.username}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
}