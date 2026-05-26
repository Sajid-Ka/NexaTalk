import { Table } from "../../../../../shared/ui/Table/Table";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";
import type { ServerSettingsMember } from "../../types";
import { getMemberColumns } from "./MembersTableColumns";

interface ServerMembersTableProps {
  members: ServerSettingsMember[];
  currentUserRole: ServerMemberRole;
  tableLoading?: boolean;
  actionLoading?: boolean;
  onPromote: (member: ServerSettingsMember) => void;
  onDemote: (member: ServerSettingsMember) => void;
  onKick: (member: ServerSettingsMember) => void;
}

export default function ServerMembersTable({
  members,
  currentUserRole,
  tableLoading = false,
  actionLoading = false,
  onPromote,
  onDemote,
  onKick,
}: ServerMembersTableProps) {
  const columns = getMemberColumns(
    currentUserRole,
    actionLoading,
    onPromote,
    onDemote,
    onKick,
  );

  return (
    <Table
      columns={columns}
      data={members}
      loading={tableLoading}
      emptyMessage="No members found"
    />
  );
}