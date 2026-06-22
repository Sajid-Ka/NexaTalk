import { useState } from "react";
import ConfirmModal from "../../../../shared/ui/ConfirmModal";
import { Table } from "../../../../shared/ui/Table/Table";
import type { ServerTableRow } from "../type/serverManagement.types";
import { getServerColumns } from "./ServerTableColumns";
import type { SortOrder } from "../../../../shared/constants/sort.const";

const ServerAction = {
  DISABLE: "disable",
  ENABLE: "enable",
  DELETE: "delete",
} as const;

type ServerAction = (typeof ServerAction)[keyof typeof ServerAction];

interface ServerTableProps {
  servers: ServerTableRow[];
  selectedServerId?: string;
  loading?: boolean;
  sortBy?: string;
  sortOrder?: SortOrder;
  onSort?: (key: string) => void;
  onSelectServer: (server: ServerTableRow) => void;
  onDisableServer: (serverId: string) => void;
  onEnableServer: (serverId: string) => void;
  onDeleteServer: (serverId: string) => void;
}

export default function ServerTable({
  servers,
  selectedServerId,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onSelectServer,
  onDisableServer,
  onEnableServer,
  onDeleteServer,
}: ServerTableProps) {
  const [modal, setModal] = useState<{
    action: ServerAction | null;
    server: ServerTableRow | null;
  }>({
    action: null,
    server: null,
  });

  const closeModal = () => {
    setModal({ action: null, server: null });
  };

  const handleConfirm = () => {
    if (!modal.server || !modal.action) return;

    if (modal.action === ServerAction.DISABLE) {
      onDisableServer(modal.server.id);
    }

    if (modal.action === ServerAction.ENABLE) {
      onEnableServer(modal.server.id);
    }

    if (modal.action === ServerAction.DELETE) {
      onDeleteServer(modal.server.id);
    }

    closeModal();
  };

  const columns = getServerColumns({
    onSelectServer,
    onDisableServer: (server) =>
      setModal({ action: ServerAction.DISABLE, server }),
    onEnableServer: (server) =>
      setModal({ action: ServerAction.ENABLE, server }),
    onDeleteServer: (server) =>
      setModal({ action: ServerAction.DELETE, server }),
  });

  const isDelete = modal.action === ServerAction.DELETE;
  const isDisable = modal.action === ServerAction.DISABLE;

  return (
    <>
      <Table
        columns={columns}
        data={servers}
        loading={loading}
        selectedRowId={selectedServerId}
        onRowClick={onSelectServer}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        emptyMessage="No servers found"
      />

      <ConfirmModal
        isOpen={!!modal.action}
        onClose={closeModal}
        onConfirm={handleConfirm}
        title={
          isDelete
            ? "Delete Server"
            : isDisable
              ? "Disable Server"
              : "Enable Server"
        }
        message={
          isDelete
            ? `Delete "${modal.server?.name}"? This action cannot be undone.`
            : isDisable
              ? `Disable "${modal.server?.name}"? Members will no longer be able to access it.`
              : `Enable "${modal.server?.name}" and restore access?`
        }
        confirmText={isDelete ? "Delete" : isDisable ? "Disable" : "Enable"}
        cancelText="Cancel"
        variant={isDelete ? "danger" : "warning"}
      />
    </>
  );
}