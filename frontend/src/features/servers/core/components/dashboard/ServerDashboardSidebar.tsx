import { Crown, Signal, Users } from "lucide-react";
import type { Server, ServerMember } from "../../types";

interface ServerDashboardSidebarProps {
  server: Server;
}

type ServerWithCounts = Server & {
  onlineCount?: number;
  channelCount?: number;
  channels?: unknown[];
};

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const getPresenceClassName = (status: ServerMember["status"]) => {
  if (status === "online") return "bg-emerald-400";
  if (status === "idle") return "bg-amber-400";
  if (status === "dnd") return "bg-rose-400";
  return "bg-slate-500";
};

const getRoleLabel = (member: ServerMember) =>
  member.role.charAt(0).toUpperCase() + member.role.slice(1);

function MemberRow({ member }: { member: ServerMember }) {
  const initials = member.username
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.04]">
      <div className="relative shrink-0">
        <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-400 to-cyan-300 text-xs font-black text-white">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.username}
              className="h-full w-full object-cover"
            />
          ) : (
            initials || member.username.charAt(0).toUpperCase()
          )}
        </div>

        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#171C2D] ${getPresenceClassName(
            member.status
          )}`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold text-white">
            {member.username}
          </p>

          {member.role === "owner" && (
            <Crown size={13} className="shrink-0 text-amber-300" />
          )}
        </div>

        <p className="truncate text-xs text-slate-400">{getRoleLabel(member)}</p>
      </div>
    </div>
  );
}

export default function ServerDashboardSidebar({
  server,
}: ServerDashboardSidebarProps) {
  const enrichedServer = server as ServerWithCounts;
  const members = server.members ?? [];
  const onlineMembers = members.filter((member) => member.status !== "offline");
  const onlineCount = enrichedServer.onlineCount ?? onlineMembers.length;
  const channelCount = enrichedServer.channelCount ?? enrichedServer.channels?.length ?? 0;

  return (
    <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
      <div className="flex h-full min-h-0 flex-col gap-4">
        <section className="rounded-2xl border border-white/10 bg-[#171C2D]/95 p-5 shadow-2xl shadow-black/20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Server Stats
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div>
              <p className="text-2xl font-black text-emerald-300">
                {formatCompact(onlineCount)}
              </p>
              <p className="mt-1 text-xs text-slate-400">Online</p>
            </div>

            <div>
              <p className="text-2xl font-black text-white">
                {formatCompact(server.memberCount)}
              </p>
              <p className="mt-1 text-xs text-slate-400">Members</p>
            </div>

            <div>
              <p className="text-2xl font-black text-indigo-300">
                {formatCompact(channelCount)}
              </p>
              <p className="mt-1 text-xs text-slate-400">Channels</p>
            </div>
          </div>
        </section>

        <section className="flex min-h-[360px] flex-1 flex-col rounded-2xl border border-white/10 bg-[#171C2D]/95 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Online Now
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {onlineCount} active member{onlineCount === 1 ? "" : "s"}
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-200">
              <Signal size={18} />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 no-scrollbar">
            {onlineMembers.length > 0 ? (
              <div className="space-y-1">
                {onlineMembers.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <div className="grid h-full min-h-48 place-items-center rounded-xl border border-dashed border-white/10 p-6 text-center">
                <div>
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-slate-400">
                    <Users size={20} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">
                    No one is online
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Active members will appear here when they join the server.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </aside>
  );
}