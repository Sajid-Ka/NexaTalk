import Button from "../../../../../shared/ui/Button";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";

interface Props {
  currentUserRole: ServerMemberRole;
  targetRole: ServerMemberRole;

  onPromote: () => void;
  onDemote: () => void;
  onKick: () => void;

  loading?: boolean;
}

export default function MemberActions({
  currentUserRole,
  targetRole,
  onPromote,
  onDemote,
  onKick,
  loading,
}: Props) {
  const isOwner =
    currentUserRole === ServerMemberRole.OWNER;

  const canKick =
    isOwner ||
    (
      currentUserRole ===
        ServerMemberRole.ADMIN &&
      targetRole ===
        ServerMemberRole.MEMBER
    );

  return (
    <div className="flex items-center gap-2">
      {isOwner &&
        targetRole ===
          ServerMemberRole.MEMBER && (
          <Button
            size="sm"
            isLoading={loading}
            onClick={onPromote}
          >
            Promote
          </Button>
      )}

      {isOwner &&
        targetRole ===
          ServerMemberRole.ADMIN && (
          <Button
            size="sm"
            variant="secondary"
            isLoading={loading}
            onClick={onDemote}
          >
            Demote
          </Button>
      )}

      {canKick &&
        targetRole !==
          ServerMemberRole.OWNER && (
          <Button
            size="sm"
            variant="destructive"
            isLoading={loading}
            onClick={onKick}
          >
            Kick
          </Button>
      )}
    </div>
  );
}