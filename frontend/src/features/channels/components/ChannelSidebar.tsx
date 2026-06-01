import { Hash, Plus, Settings, Volume2, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChannelType } from "../../../shared/constants/channel.const";
import { cn } from "../../../shared/utils/cn";
import UserStatusFooter from "../../home/components/UserStatusFooter";
import type { Server } from "../../servers/core/types";
import type { Channel } from "../types";

interface ChannelSidebarProps {
  server: Server;
  channels: Channel[];
  selectedChannelId?: string;
  canManageChannels: boolean;
  onSelectChannel: (channel: Channel) => void;
  onCreateClick: (type: ChannelType) => void;
  onServerHomeClick: () => void;
  onRenameClick: (channel: Channel) => void;
  onDeleteClick: (channel: Channel) => void;
}

export default function ChannelSidebar({
  server,
  channels,
  selectedChannelId,
  canManageChannels,
  onSelectChannel,
  onCreateClick,
  onServerHomeClick,
  onRenameClick,
  onDeleteClick,
}: ChannelSidebarProps) {
  const navigate = useNavigate();
  const textChannels = channels.filter((channel) => channel.type === ChannelType.TEXT);
  const voiceChannels = channels.filter((channel) => channel.type === ChannelType.VOICE);

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-white/5 bg-[#0B0D16]">
      <div className="flex h-14 items-center justify-between border-b border-white/5 px-4">
        <button
          type="button"
          onClick={onServerHomeClick}
          className="min-w-0 truncate text-left text-sm font-bold text-white hover:underline"
        >
          {server.name}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/servers/${server.id}/settings`)}
          className="rounded-lg p-1.5 text-white/45 transition hover:bg-white/5 hover:text-white"
          aria-label="Open server settings"
        >
          <Settings size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <ChannelGroup
          title="Text Channels"
          type={ChannelType.TEXT}
          channels={textChannels}
          selectedChannelId={selectedChannelId}
          canManageChannels={canManageChannels}
          onSelectChannel={onSelectChannel}
          onCreateClick={onCreateClick}
          onRenameClick={onRenameClick}
          onDeleteClick={onDeleteClick}
        />

        <ChannelGroup
          title="Voice Channels"
          type={ChannelType.VOICE}
          channels={voiceChannels}
          selectedChannelId={selectedChannelId}
          canManageChannels={canManageChannels}
          onSelectChannel={onSelectChannel}
          onCreateClick={onCreateClick}
          onRenameClick={onRenameClick}
          onDeleteClick={onDeleteClick}
        />
      </div>

      <UserStatusFooter />
    </aside>
  );
}

interface ChannelGroupProps {
  title: string;
  type: ChannelType;
  channels: Channel[];
  selectedChannelId?: string;
  canManageChannels: boolean;
  onSelectChannel: (channel: Channel) => void;
  onCreateClick: (type: ChannelType) => void;
  onRenameClick: (channel: Channel) => void;
  onDeleteClick: (channel: Channel) => void;
}

function ChannelGroup({
  title,
  type,
  channels,
  selectedChannelId,
  canManageChannels,
  onSelectChannel,
  onCreateClick,
  onRenameClick,
  onDeleteClick,
}: ChannelGroupProps) {
  const Icon = type === ChannelType.TEXT ? Hash : Volume2;

  return (
    <section className="mb-5">
      <div className="mb-1 flex items-center justify-between px-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/35">
          {title}
        </p>
        {canManageChannels && (
          <button
            type="button"
            onClick={() => onCreateClick(type)}
            className="rounded p-1 text-white/35 transition hover:bg-white/5 hover:text-white"
            aria-label={`Create ${title.toLowerCase()}`}
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      <div className="space-y-1">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={cn(
              "group flex h-9 w-full items-center rounded-lg px-2 transition",
              selectedChannelId === channel.id
                ? "bg-white/10 text-white"
                : "text-white/50 hover:bg-white/[0.06] hover:text-white/80",
            )}
          >
            <button
              type="button"
              onClick={() => onSelectChannel(channel)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
            >
              <Icon size={16} className="shrink-0" />
              <span className="truncate">{channel.name}</span>
            </button>

            {canManageChannels && (
              <div className="ml-2 hidden shrink-0 items-center gap-1 group-hover:flex">
                <button
                  type="button"
                  onClick={() => onRenameClick(channel)}
                  className="rounded p-1 text-white/35 hover:bg-white/10 hover:text-white"
                  aria-label="Rename channel"
                >
                  <Pencil size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteClick(channel)}
                  className="rounded p-1 text-white/35 hover:bg-red-500/15 hover:text-red-300"
                  aria-label="Delete channel"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        ))}

        {channels.length === 0 && (
          <p className="px-2 py-2 text-xs text-white/25">No channels yet</p>
        )}
      </div>
    </section>
  );
}
