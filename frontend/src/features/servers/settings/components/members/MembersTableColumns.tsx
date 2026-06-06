import Avatar from "../../../../../shared/ui/Avatar";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";
import type { Column } from "../../../../../shared/ui/Table/Table";
import type { ServerSettingsMember } from "../../types";

import MembersRoleBadge from "./MemberRoleBadge";
import MembersAction from "./MemberActions";

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-emerald-500";
    case "idle":
      return "bg-amber-500";
    case "dnd":
      return "bg-red-500";
    default:
      return "bg-slate-500";
  }
};

export const getMemberColumns = (
  currentUserRole: ServerMemberRole,
  loading: boolean,
  onPromote: (member: ServerSettingsMember) => void,
  onDemote: (member: ServerSettingsMember) => void,
  onTransferOwnership: (member: ServerSettingsMember) => void,
  onKick: (member: ServerSettingsMember) => void,
): Column<ServerSettingsMember>[] => [
  {
    key: "username",
    header: "Member",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar
            src={row.avatar}
            alt={row.username}
            fallback={row.username}
            size="md"
          />

          <span
            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111827] ${getStatusColor(
              row.status,
            )}`}
          />
        </div>

        <div>
          <p className="font-medium text-white">{row.username}</p>
          <p className="text-xs text-slate-400">#{row.userId.slice(-6)}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (_, row) => <MembersRoleBadge role={row.role} />,
  },
  {
    key: "joinedAt",
    header: "Joined",
    render: (date) => (
      <span className="text-sm text-slate-400">
        {new Date(date as string).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "userId",
    header: "Actions",
    align: "right",
    render: (_, row) => (
      <MembersAction
        member={row}
        currentUserRole={currentUserRole}
        loading={loading}
        onPromote={onPromote}
        onDemote={onDemote}
        onTransferOwnership={onTransferOwnership}
        onKick={onKick}
      />
    ),
  },
];