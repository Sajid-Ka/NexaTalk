import { Lock, Settings, Share2, Sparkles, Users, Wifi } from "lucide-react";
import type { Server } from "../../types";
import Button from "../../../../shared/ui/Button";
import Badge from "../../../../shared/ui/Badge";
import { useAuth } from "../../../auth/context/useAuth";

interface ServerDashboardHeroProps {
  server: Server;
}

type ServerWithOnlineCount = Server & {
  onlineCount?: number;
};

const formatCompact = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function ServerDashboardHero({
  server,
}: ServerDashboardHeroProps) {
  const enrichedServer = server as ServerWithOnlineCount;
  const members = server.members ?? [];
  const onlineCount =
    enrichedServer.onlineCount ??
    members.filter((member) => member.status !== "offline").length;

  const fallbackInitial = server.name.charAt(0).toUpperCase();
  const tags = server.tags ?? [];

  const { user } = useAuth();

  const isOwner = user?.id === server.ownerId;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070A12]">
      <div className="absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 lg:right-8">
        <Button
          type="button"
          size="sm"
          className="gap-2 border-white/10 bg-white/10 text-white shadow-none backdrop-blur-xl hover:bg-white/15"
        >
          <Share2 size={15} />
          Invite
        </Button>
        {isOwner && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="gap-2 border-white/15 bg-[#0B1020]/70 text-white/80 backdrop-blur-xl hover:bg-white/10"
          >
            <Settings size={15} />
            Settings
          </Button>
        )}
      </div>

      <div className="relative h-[380px] overflow-hidden sm:h-[360px]">
        {server.banner ? (
          <img
            src={server.banner}
            alt={`${server.name} banner`}
            className="h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_32%),radial-gradient(circle_at_74%_28%,rgba(20,184,166,0.32),transparent_30%),linear-gradient(135deg,#312E81_0%,#0B1220_46%,#042F2E_100%)]" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,18,0.08)_0%,rgba(7,10,18,0.42)_46%,#070A12_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,10,18,0.92)_0%,rgba(7,10,18,0.46)_45%,rgba(7,10,18,0.72)_100%)]" />

      <div className="relative z-20 mx-auto -mt-44 flex w-full max-w-[1680px] flex-col gap-5 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex max-w-4xl flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-[28px] border-4 border-[#070A12] bg-[#111827] shadow-2xl shadow-indigo-950/50 ring-1 ring-white/15">
              {server.icon ? (
                <img
                  src={server.icon}
                  alt={server.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="bg-gradient-to-br from-indigo-300 to-cyan-300 bg-clip-text text-4xl font-black text-transparent">
                  {fallbackInitial}
                </span>
              )}
            </div>

            <div className="space-y-3 pb-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                  {server.name}
                </h1>

                <Badge
                  variant={server.privacy === "public" ? "success" : "warning"}
                  className="gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white backdrop-blur"
                >
                  {server.privacy === "public" ? (
                    <Sparkles size={12} />
                  ) : (
                    <Lock size={12} />
                  )}
                  {server.privacy}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1">
                  <Wifi size={14} className="text-emerald-300" />
                  {formatCompact(onlineCount)} online
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1">
                  <Users size={14} className="text-indigo-300" />
                  {formatCompact(server.memberCount)} members
                </span>
              </div>
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
            {server.description || "A new NexaTalk community ready for channels, members, and live conversations."}
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}