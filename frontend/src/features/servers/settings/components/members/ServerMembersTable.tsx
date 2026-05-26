import { Table } from "../../../../../shared/ui/Table/Table";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";
import type { ServerSettingsMember } from "../../types";
import { getMemberColumns } from "./MembersTableColumns";

interface ServerMembersTableProps {
  members: ServerSettingsMember[];
  currentUserRole: ServerMemberRole;
  loading?: boolean;
  onPromote: (member: ServerSettingsMember) => void;
  onDemote: (member: ServerSettingsMember) => void;
  onKick: (member: ServerSettingsMember) => void;
}

export default function ServerMembersTable({
  members,
  currentUserRole,
  loading = false,
  onPromote,
  onDemote,
  onKick,
}: ServerMembersTableProps) {
  const columns = getMemberColumns(
    currentUserRole,
    loading,
    onPromote,
    onDemote,
    onKick
  );

  return (
    <Table
      columns={columns}
      data={members}
      loading={loading}
      emptyMessage="No members found"
    />
  );
}