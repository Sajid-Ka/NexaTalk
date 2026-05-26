import Avatar from "../../../../../shared/ui/Avatar";
import type { ServerSettingsMember } from "../../../core/types";
import MemberRoleBadge from "./MemberRoleBadge";
import MemberActions from "./MemberActions";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";

interface Props {
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
  loading,
  onPromote,
  onDemote,
  onKick,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full">
        <thead className="bg-white/[0.03]">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Member
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Role
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              Joined
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr
              key={member.id}
              className="border-t border-white/5"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    fallback={member.username}
                    size="md"
                  />

                  <div>
                    <p className="font-medium text-white">
                      {member.username}
                    </p>

                    <p className="text-xs text-slate-400">
                      {member.status}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <MemberRoleBadge
                  role={member.role}
                />
              </td>

              <td className="px-6 py-4 text-sm text-slate-400">
                {new Date(
                  member.joinedAt,
                ).toLocaleDateString()}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end">
                  <MemberActions
                    currentUserRole={
                      currentUserRole
                    }
                    targetRole={member.role}
                    loading={loading}
                    onPromote={() =>
                      onPromote(member)
                    }
                    onDemote={() =>
                      onDemote(member)
                    }
                    onKick={() =>
                      onKick(member)
                    }
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}