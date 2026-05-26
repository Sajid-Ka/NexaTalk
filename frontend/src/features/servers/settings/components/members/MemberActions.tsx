import { UserCog, UserX } from "lucide-react";

import Button from "../../../../../shared/ui/Button";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";
import type { ServerSettingsMember } from "../../types";

interface MembersActionProps {
  member: ServerSettingsMember;
  currentUserRole: ServerMemberRole;
  loading: boolean;
  onPromote: (member: ServerSettingsMember) => void;
  onDemote: (member: ServerSettingsMember) => void;
  onKick: (member: ServerSettingsMember) => void;
}

export default function MembersAction({
  member,
  currentUserRole,
  loading,
  onPromote,
  onDemote,
  onKick,
}: MembersActionProps) {
  const isOwner = currentUserRole === ServerMemberRole.OWNER;
  const isAdmin = currentUserRole === ServerMemberRole.ADMIN;
  const isTargetOwner = member.role === ServerMemberRole.OWNER;

  const canPromote = isOwner && member.role === ServerMemberRole.MEMBER;
  const canDemote = isOwner && member.role === ServerMemberRole.ADMIN;

  const canKick =
    !isTargetOwner &&
    ((isOwner && member.role !== ServerMemberRole.OWNER) ||
      (isAdmin && member.role === ServerMemberRole.MEMBER));

  return (
    <div className="flex items-center justify-end gap-2">
      {canPromote && (
        <Button
          size="sm"
          variant="secondary"
          isLoading={loading}
          onClick={() => onPromote(member)}
          className="gap-1"
        >
          <UserCog size={14} />
          Promote
        </Button>
      )}

      {canDemote && (
        <Button
          size="sm"
          variant="secondary"
          isLoading={loading}
          onClick={() => onDemote(member)}
        >
          Demote
        </Button>
      )}

      {canKick && (
        <Button
          size="sm"
          variant="destructive"
          isLoading={loading}
          onClick={() => onKick(member)}
          className="gap-1"
        >
          <UserX size={14} />
          Kick
        </Button>
      )}
    </div>
  );
}