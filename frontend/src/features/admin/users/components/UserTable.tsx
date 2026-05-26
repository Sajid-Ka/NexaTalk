import { useState } from "react";

import ConfirmModal from "../../../../shared/ui/ConfirmModal";
import { Table } from "../../../../shared/ui/Table/Table";
import { useAuth } from "../../../auth/context/useAuth";
import type { User } from "../type/userManagement.types";
import { getUserColumns } from "./UserTableColumns";

interface UserTableProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (user: User) => void;
  onBlockUser: (userId: string) => void;
  onUnblockUser: (userId: string) => void;
  onForceLogout: (userId: string) => void;
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
  onForceLogout,
  onDeleteUser,
  sortBy,
  sortOrder,
  onSort,
}: UserTableProps) {
  const { user: currentUser } = useAuth();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    username: string;
  }>({
    isOpen: false,
    userId: "",
    username: "",
  });

  const columns = getUserColumns({
    currentUserId: currentUser?.id,
    onSelectUser,
    onBlockUser,
    onUnblockUser,
    onForceLogout,
    onDeleteClick: (user) => {
      setDeleteModal({
        isOpen: true,
        userId: user.id,
        username: user.username,
      });
    },
  });

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