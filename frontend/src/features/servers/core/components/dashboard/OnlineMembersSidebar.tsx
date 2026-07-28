import Avatar from "../../../../../shared/ui/Avatar";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";
import { UserPresence } from "../../../../../shared/constants/user.const";
import type { ServerMember } from "../../types";

interface OnlineMembersSidebarProps {
  members: ServerMember[];
}

export default function OnlineMembersSidebar({ members }: OnlineMembersSidebarProps) {
  const onlineMembers = members.filter((member) => member.status !== UserPresence.OFFLINE);
  const offlineMembers = members.filter((member) => member.status === UserPresence.OFFLINE);

  return (
    <aside className="hidden h-full w-64 shrink-0 border-l border-white/5 bg-[#0B0D16] px-4 py-5 xl:block">
      <MemberSection title="Online" count={onlineMembers.length} members={onlineMembers} />

      <div className="mt-7">
        <MemberSection
          title="Offline"
          count={offlineMembers.length}
          members={offlineMembers}
          muted
        />
      </div>
    </aside>
  );
}

function MemberSection({
  title,
  count,
  members,
  muted = false,
}: {
  title: string;
  count: number;
  members: ServerMember[];
  muted?: boolean;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/35">{title}</p>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-white/45">
          {count}
        </span>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.04]"
          >
            <Avatar
              src={member.avatar}
              fallback={member.username}
              status={member.status}
              size="sm"
              userId={member.userId}
            />
            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${muted ? "text-white/35" : "text-white/85"}`}
              >
                {member.username}
              </p>
              <p className="text-xs capitalize text-white/35">
                {member.role === ServerMemberRole.OWNER ? "Owner" : member.role}
              </p>
            </div>
          </div>
        ))}

        {members.length === 0 && !muted && (
          <p className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-4 text-sm text-white/40">
            No members online right now.
          </p>
        )}
      </div>
    </section>
  );
}
