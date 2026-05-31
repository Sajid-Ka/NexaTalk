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

type ConfirmAction = "block" | "forceLogout" | "delete";

interface ConfirmState {
  isOpen: boolean;
  action: ConfirmAction | null;
  userId: string;
  username: string;
}

const initialConfirmState: ConfirmState = {
  isOpen: false,
  action: null,
  userId: "",
  username: "",
};

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

  const [confirmModal, setConfirmModal] =
    useState<ConfirmState>(initialConfirmState);

  const openConfirmModal = (action: ConfirmAction, user: User) => {
    setConfirmModal({
      isOpen: true,
      action,
      userId: user.id,
      username: user.username,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(initialConfirmState);
  };

  const columns = getUserColumns({
    currentUserId: currentUser?.id,
    onSelectUser,
    onBlockClick: (user) => openConfirmModal("block", user),
    onUnblockUser,
    onForceLogoutClick: (user) => openConfirmModal("forceLogout", user),
    onDeleteClick: (user) => openConfirmModal("delete", user),
  });

  const handleConfirmAction = () => {
    if (confirmModal.action === "block") {
      onBlockUser(confirmModal.userId);
    }

    if (confirmModal.action === "forceLogout") {
      onForceLogout(confirmModal.userId);
    }

    if (confirmModal.action === "delete") {
      onDeleteUser(confirmModal.userId);
    }

    closeConfirmModal();
  };

  const modalConfig = {
    block: {
      title: "Block User",
      message: `Are you sure you want to block user "${confirmModal.username}"? They will lose access to the platform.`,
      confirmText: "Block",
      variant: "danger" as const,
    },
    forceLogout: {
      title: "Force Logout",
      message: `Are you sure you want to force logout user "${confirmModal.username}" from all active sessions?`,
      confirmText: "Force Logout",
      variant: "warning" as const,
    },
    delete: {
      title: "Delete User",
      message: `Are you sure you want to delete user "${confirmModal.username}"? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger" as const,
    },
  };

  const activeModalConfig = confirmModal.action
    ? modalConfig[confirmModal.action]
    : modalConfig.delete;

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
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirmAction}
        title={activeModalConfig.title}
        message={activeModalConfig.message}
        confirmText={activeModalConfig.confirmText}
        cancelText="Cancel"
        variant={activeModalConfig.variant}
      />
    </>
  );
}