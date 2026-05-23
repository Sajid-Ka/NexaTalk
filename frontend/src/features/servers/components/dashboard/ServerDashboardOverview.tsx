import {
  Hash,
  Mic2,
  Plus,
  Radio,
  Sparkles,
  Users,
  Volume2,
} from "lucide-react";
import type { Server } from "../../types";
import Button from "../../../../shared/ui/Button";

interface ServerDashboardOverviewProps {
  server: Server;
}

type DashboardChannelType = "text" | "voice" | "TEXT" | "VOICE";

interface DashboardChannel {
  id: string;
  name: string;
  description?: string;
  type?: DashboardChannelType;
  kind?: DashboardChannelType;
  unreadCount?: number;
  memberCount?: number;
  isLive?: boolean;
}

type ServerWithChannels = Server & {
  channels?: DashboardChannel[];
};

const normalizeChannelType = (channel: DashboardChannel): "text" | "voice" => {
  const value = String(channel.type ?? channel.kind ?? "text").toLowerCase();
  return value === "voice" ? "voice" : "text";
};

const fallbackTextChannels: DashboardChannel[] = [];
const fallbackVoiceChannels: DashboardChannel[] = [];

function ChannelEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-200">
        <Sparkles size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-white">No channels yet</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        Start the community with a focused text space or open a voice room for live hangouts.
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button type="button" className="gap-2 bg-indigo-500 hover:bg-indigo-400">
          <Plus size={16} />
          Create Text Channel
        </Button>

        <Button
          type="button"
          variant="outline"
          className="gap-2 border-cyan-300/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15"
        >
          <Plus size={16} />
          Create Voice Channel
        </Button>
      </div>
    </div>
  );
}

function TextChannelCard({ channel }: { channel: DashboardChannel }) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-[#151A2A]/90 p-4 transition hover:-translate-y-0.5 hover:border-indigo-300/35 hover:bg-[#1A2033]">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-200">
          <Hash size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-sm font-bold text-white">
              {channel.name}
            </h3>

            {Boolean(channel.unreadCount) && (
              <span className="grid min-w-6 place-items-center rounded-full bg-indigo-500 px-2 py-0.5 text-[11px] font-bold text-white">
                {channel.unreadCount}
              </span>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
            {channel.description || "Community discussion and updates."}
          </p>
        </div>
      </div>
    </article>
  );
}

function VoiceChannelCard({ channel }: { channel: DashboardChannel }) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-[#151A2A]/90 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-[#1A2033]">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/15 text-cyan-200">
          {channel.isLive ? <Radio size={19} /> : <Volume2 size={19} />}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-white">
            {channel.name}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-cyan-200">
            <Users size={13} />
            {channel.memberCount ?? 0} listening
          </p>
        </div>

        <Mic2 size={16} className="text-slate-500 transition group-hover:text-cyan-200" />
      </div>
    </article>
  );
}

export default function ServerDashboardOverview({
  server,
}: ServerDashboardOverviewProps) {
  const channels = (server as ServerWithChannels).channels ?? [];
  const textChannels =
    channels.length > 0
      ? channels.filter((channel) => normalizeChannelType(channel) === "text")
      : fallbackTextChannels;

  const voiceChannels =
    channels.length > 0
      ? channels.filter((channel) => normalizeChannelType(channel) === "voice")
      : fallbackVoiceChannels;

  const hasChannels = textChannels.length > 0 || voiceChannels.length > 0;

  return (
    <main className="min-w-0 space-y-10">
      {!hasChannels ? (
        <ChannelEmptyState />
      ) : (
        <>
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200/70">
                  Text Channels
                </p>
                <h2 className="mt-1 text-xl font-black text-white">
                  Conversations
                </h2>
              </div>

              <Button type="button" size="sm" variant="outline" className="gap-2">
                <Plus size={15} />
                Create
              </Button>
            </div>

            {textChannels.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {textChannels.map((channel) => (
                  <TextChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                No text channels have been created yet.
              </div>
            )}
          </section>

          <section className="space-y-4 border-t border-white/10 pt-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/70">
                  Voice Channels
                </p>
                <h2 className="mt-1 text-xl font-black text-white">
                  Live Rooms
                </h2>
              </div>

              <Button type="button" size="sm" variant="outline" className="gap-2">
                <Plus size={15} />
                Create
              </Button>
            </div>

            {voiceChannels.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {voiceChannels.map((channel) => (
                  <VoiceChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
                No voice channels have been created yet.
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}