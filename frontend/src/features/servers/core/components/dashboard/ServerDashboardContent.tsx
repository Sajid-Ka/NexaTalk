import { useEffect, useMemo, useState } from "react";
import {
  Crown,
  Hash,
  Lock,
  Plus,
  Settings,
  Users,
  Volume2,
  Wifi,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../../../auth/context/useAuth";
import ChannelPage from "../../../../channels/pages/ChannelPage";
import ChannelRenameModal from "../../../../channels/components/ChannelRenameModal";
import ConfirmModal from "../../../../../shared/ui/ConfirmModal";
import {
  createChannelApi,
  deleteChannelApi,
  getChannelsApi,
  updateChannelApi,
} from "../../../../channels/api/channelApi";
import ChannelCreateModal from "../../../../channels/components/ChannelCreateModal";
import type { Channel } from "../../../../channels/types";
import {
  ChannelType,
  type ChannelType as ChannelTypeValue,
} from "../../../../../shared/constants/channel.const";
import { ServerMemberRole } from "../../../../../shared/constants/server.const";
import { UserPresence } from "../../../../../shared/constants/user.const";
import Avatar from "../../../../../shared/ui/Avatar";
import UserStatusFooter from "../../../../home/components/UserStatusFooter";
import type { Server, ServerMember } from "../../types";


interface Props {
  server: Server;
}

interface ApiError {
  response?: {
    data?: {
      error?: { message?: string };
      message?: string;
    };
  };
  message?: string;
}

//image setting helper function
const getImageUrl = (url?: string) => {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const apiBaseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  const apiOrigin = new URL(apiBaseUrl, window.location.origin).origin;

  return url.startsWith("/") ? `${apiOrigin}${url}` : `${apiOrigin}/${url}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as ApiError;

  return (
    apiError.response?.data?.error?.message ||
    apiError.response?.data?.message ||
    apiError.message ||
    fallback
  );
};

export default function ServerDashboardContent({ server }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [channels, setChannels] = useState<Channel[]>([]);
  const { channelId } = useParams<{ channelId: string}>();
  const selectedChannel = channels.find((c) => c.id === channelId) || null;
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [creatingChannel, setCreatingChannel] = useState(false);

  const [createModal, setCreateModal] = useState<{
    isOpen: boolean;
    type: ChannelTypeValue;
  }>({
    isOpen: false,
    type: ChannelType.TEXT,
  });

  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    channel: Channel | null;
  }>({
    isOpen: false,
    channel: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    channel: Channel | null;
  }>({
    isOpen: false,
    channel: null,
  });

  const [actionLoading, setActionLoading] = useState(false);

  const members = useMemo(() => server.members ?? [], [server.members]);
  const onlineMembers = members.filter((member) => member.status !== "offline");

  const currentMember = useMemo(
    () => members.find((member) => member.userId === user?.id),
    [members, user?.id],
  );

  const canManageChannels =
    server.ownerId === user?.id ||
    currentMember?.role === ServerMemberRole.OWNER ||
    currentMember?.role === ServerMemberRole.ADMIN;

  useEffect(() => {
    let cancelled = false;

    const loadChannels = async () => {
      try {
        setLoadingChannels(true);

        const response = await getChannelsApi(server.id);
        const nextChannels = response.data.data as Channel[];

        if (!cancelled) {
          setChannels(nextChannels);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(getErrorMessage(error, "Failed to load channels"));
        }
      } finally {
        if (!cancelled) {
          setLoadingChannels(false);
        }
      }
    };

    loadChannels();

    return () => {
      cancelled = true;
    };
  }, [server.id]);

  const openCreateModal = (type: ChannelTypeValue) => {
    setCreateModal({ isOpen: true, type });
  };

  const handleCreateChannel = async (data: {
    name: string;
    type: ChannelTypeValue;
  }) => {
    try {
      setCreatingChannel(true);

      const response = await createChannelApi(server.id, data);
      const createdChannel = response.data.data as Channel;

      setChannels((current) => [...current, createdChannel]);
      navigate(`/servers/${server.id}/channels/${createdChannel.id}`)
      setCreateModal((current) => ({ ...current, isOpen: false }));

      toast.success("Channel created");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create channel"));
    } finally {
      setCreatingChannel(false);
    }
  };

  const handleRenameChannel = async (name: string) => {
    if (!renameModal.channel) return;

    try {
      setActionLoading(true);

      const response = await updateChannelApi(
        server.id,
        renameModal.channel.id,
        { name },
      );

      const updatedChannel = response.data.data as Channel;

      setChannels((current) =>
        current.map((channel) =>
          channel.id === updatedChannel.id ? updatedChannel : channel,
        ),
      );

      setRenameModal({ isOpen: false, channel: null });
      toast.success("Channel renamed");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to rename channel"));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteChannel = async () => {
    if (!deleteModal.channel) return;

    try {
      setActionLoading(true);

      await deleteChannelApi(server.id, deleteModal.channel.id);

      setChannels((current) =>
        current.filter((channel) => channel.id !== deleteModal.channel?.id),
      );

      if(deleteModal.channel?.id === channelId){
        navigate(`/servers/${server.id}`);
      }

      setDeleteModal({ isOpen: false, channel: null });
      toast.success("Channel deleted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete channel"));
    } finally {
      setActionLoading(false);
    }
  };

  if (selectedChannel) {
    return (
      <>
        <ChannelPage
          server={server}
          members={members}
          channels={channels}
          selectedChannel={selectedChannel}
          canManageChannels={canManageChannels}
          onSelectChannel={(channel) => navigate(`/servers/${server.id}/channels/${channel.id}`)}
          onCreateClick={openCreateModal}
          onServerHomeClick={() => navigate(`/servers/${server.id}`)}
          onRenameClick={(channel) => setRenameModal({ isOpen: true, channel })}
          onDeleteClick={(channel) => setDeleteModal({ isOpen: true, channel })}
        />

        {createModal.isOpen && (
          <ChannelCreateModal
            isOpen={createModal.isOpen}
            loading={creatingChannel}
            initialType={createModal.type}
            onClose={() =>
              setCreateModal((current) => ({ ...current, isOpen: false }))
            }
            onCreate={handleCreateChannel}
          />
        )}

        <ChannelRenameModal
          isOpen={renameModal.isOpen}
          channel={renameModal.channel}
          loading={actionLoading}
          onClose={() => setRenameModal({ isOpen: false, channel: null })}
          onRename={handleRenameChannel}
        />

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, channel: null })}
          onConfirm={handleDeleteChannel}
          title={`Delete ${deleteModal.channel?.name}?`}
          message="This channel will be permanently deleted."
          confirmText="Delete Channel"
        />
      </>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-1 overflow-hidden bg-[#070A12] text-white">

      <main className="min-w-0 flex-1 overflow-hidden">
        <ServerHomePane
          server={server}
          channels={channels}
          onlineCount={onlineMembers.length}
          loadingChannels={loadingChannels}
          canManageChannels={canManageChannels}
          onSelectChannel={(channel) => navigate(`/servers/${server.id}/channels/${channel.id}`)}
          onCreateClick={openCreateModal}
          onSettingsClick={() => navigate(`/servers/${server.id}/settings`)}
        />
      </main>

      {createModal.isOpen && (
        <ChannelCreateModal
          isOpen={createModal.isOpen}
          loading={creatingChannel}
          initialType={createModal.type}
          onClose={() =>
            setCreateModal((current) => ({ ...current, isOpen: false }))
          }
          onCreate={handleCreateChannel}
        />
      )}
    </div>
  );
}

interface ServerHomePaneProps {
  server: Server;
  channels: Channel[];
  onlineCount: number;
  loadingChannels: boolean;
  canManageChannels: boolean;
  onSelectChannel: (channel: Channel) => void;
  onCreateClick: (type: ChannelTypeValue) => void;
  onSettingsClick: () => void;
}

function ServerHomePane({
  server,
  channels,
  onlineCount,
  loadingChannels,
  canManageChannels,
  onSelectChannel,
  onCreateClick,
  onSettingsClick,
}: ServerHomePaneProps) {
  const textChannels = channels.filter((channel) => channel.type === ChannelType.TEXT);
  const voiceChannels = channels.filter((channel) => channel.type === ChannelType.VOICE);
  const members = server.members ?? [];
  const onlineMembers = members.filter((member) => member.status !== UserPresence.OFFLINE);
  const memberCount = server.memberCount || members.length;

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-[#050812]">
      <section className="relative shrink-0 overflow-hidden border-b border-white/10 bg-[#070A12] px-6 pb-2 pt-2 sm:px-8 lg:px-12">
        {server.banner ? (
          <img
            src={getImageUrl(server.banner)}
            alt={`${server.name} banner`}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.22),transparent_32%),linear-gradient(135deg,#080B16_0%,#0B1020_52%,#050812_100%)]" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,18,0.95)_0%,rgba(5,8,18,0.62)_46%,rgba(5,8,18,0.88)_100%)]" />
        <div className="absolute right-0 top-0 hidden h-full w-1/2 opacity-45 lg:block">
          <div className="absolute right-[-6%] top-10 h-px w-[82%] rotate-[-8deg] bg-white/10" />
          <div className="absolute right-[-4%] top-24 h-px w-[70%] rotate-[5deg] bg-white/10" />
          <div className="absolute right-[8%] top-0 h-32 w-48 -skew-x-12 border-t border-white/10" />
        </div>

        <div className="relative z-10">
          <div className="mb-5 flex justify-end gap-3">

            {canManageChannels && (
              <button
                onClick={onSettingsClick}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white/85 hover:bg-white/10"
              >
                <Settings size={15} />
                Settings
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-[#111827] text-4xl font-black text-cyan-300 shadow-2xl shadow-black/40 ring-1 ring-violet-400/20 xl:h-28 xl:w-28 xl:rounded-[28px]">
              {server.icon ? (
                <img
                  src={getImageUrl(server.icon)}
                  alt={server.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                server.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-4xl font-black text-white xl:text-5xl">{server.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-bold uppercase text-white shadow-inner">
                  <Lock size={13} />
                  {server.privacy}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">
                  <Wifi size={14} />
                  {onlineCount} online
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-sm text-indigo-100">
                  <Users size={14} />
                  {memberCount} members
                </span>
              </div>

              {server.description && (
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/80">
                  {server.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-h-0 flex-1 gap-4 overflow-hidden px-6 pb-20 pt-5 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-4">
          {loadingChannels ? (
            <div className="min-h-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-8 text-sm text-white/45">
              Loading channels...
            </div>
          ) : (
            <>
              <ChannelCardSection
                title="Text Channels"
                emptyText="No text channels yet."
                channels={textChannels}
                type={ChannelType.TEXT}
                canManageChannels={canManageChannels}
                onSelectChannel={onSelectChannel}
                onCreateClick={onCreateClick}
              />

              <ChannelCardSection
                title="Voice Channels"
                emptyText="No voice channels yet."
                channels={voiceChannels}
                type={ChannelType.VOICE}
                canManageChannels={canManageChannels}
                onSelectChannel={onSelectChannel}
                onCreateClick={onCreateClick}
              />
            </>
          )}
        </div>

        <aside className="min-h-0 min-w-0 overflow-hidden">
          <ServerStatusPanel
            channelsCount={channels.length}
            memberCount={memberCount}
            onlineMembers={onlineMembers}
            onlineCount={onlineCount}
          />
        </aside>
      </section>

      <div className="absolute bottom-0 left-0 z-20 w-full border-t border-white/10 bg-[#050812]/95 shadow-2xl shadow-black/50 backdrop-blur sm:left-0 sm:w-[320px] sm:rounded-tr-2xl sm:border-r">
        <UserStatusFooter />
      </div>
    </div>
  );
}

interface ChannelCardSectionProps {
  title: string;
  emptyText: string;
  channels: Channel[];
  type: ChannelTypeValue;
  canManageChannels: boolean;
  onSelectChannel: (channel: Channel) => void;
  onCreateClick: (type: ChannelTypeValue) => void;
}

function ChannelCardSection({
  title,
  emptyText,
  channels,
  type,
  canManageChannels,
  onSelectChannel,
  onCreateClick,
}: ChannelCardSectionProps) {
  const Icon = type === ChannelType.TEXT ? Hash : Volume2;
  const CreateIcon = type === ChannelType.TEXT ? Plus : Volume2;

  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080C17]/80 p-5 shadow-2xl shadow-black/20 ${
        type === ChannelType.TEXT
          ? "min-h-[230px] flex-[1_1_0] basis-0"
          : "min-h-[230px] flex-[0.8_1_0] basis-0"
      }`}
    >
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
        <h2 className="text-xs font-black uppercase tracking-[0.28em] text-white/80">
          {title}
          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400 align-middle shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
        </h2>

        <button className="inline-flex items-center gap-2 text-xs font-medium text-indigo-100/90 transition hover:text-white">
          View All Channels
          <span aria-hidden="true">&rsaquo;</span>
        </button>
      </div>

      {channels.length === 0 && !canManageChannels ? (
        <div className="min-h-0 flex-1 rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/45">
          {emptyText}
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
            {canManageChannels && (
              <button
                type="button"
                onClick={() => onCreateClick(type)}
                className="group flex h-36 min-h-36 flex-col items-center justify-center gap-3 rounded-xl border border-violet-400/55 bg-[#0A0E18] px-4 text-center text-white shadow-inner shadow-violet-500/5 transition hover:border-violet-300 hover:bg-violet-500/10"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-violet-400/45 bg-violet-500/10 text-violet-200 shadow-[0_0_24px_rgba(124,92,255,0.25)] transition group-hover:scale-105">
                  <CreateIcon size={30} />
                </span>
                <span className="text-base font-extrabold leading-tight">Create Channel</span>
              </button>
            )}

            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className="group relative flex h-36 min-h-36 items-center justify-center rounded-xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] px-4 text-center transition hover:border-indigo-400/50 hover:bg-white/[0.09]"
              >
                <span className="absolute right-3 top-3 flex items-center gap-2 text-white/80 opacity-90">
                  <Users size={15} />
                  <Settings size={14} />
                </span>

                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-white/45 opacity-0 transition group-hover:opacity-100">
                  <Icon size={16} />
                </span>

                <span className="block w-full truncate text-base font-extrabold text-white">
                  {channel.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ServerStatusPanel({
  channelsCount,
  memberCount,
  onlineMembers,
  onlineCount,
}: {
  channelsCount: number;
  memberCount: number;
  onlineMembers: ServerMember[];
  onlineCount: number;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(150deg,rgba(255,255,255,0.075),rgba(255,255,255,0.03))] p-5 shadow-2xl shadow-black/30">
      <h2 className="text-xs font-black uppercase tracking-[0.28em] text-white/85">
        Server Status
        <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400 align-middle shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
      </h2>

      <div className="mt-6 grid shrink-0 grid-cols-3 gap-3">
        <StatValue icon={<Wifi size={30} />} label="Online" value={onlineCount} tone="emerald" />
        <StatValue icon={<Users size={30} />} label="Members" value={memberCount} tone="violet" />
        <StatValue icon={<Hash size={30} />} label="Channels" value={channelsCount} tone="blue" />
      </div>

      <div className="my-7 h-px shrink-0 bg-white/10" />

      <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-white">
          Online Users ({onlineMembers.length})
          <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        </h3>
        <button className="inline-flex items-center gap-2 text-xs font-medium text-indigo-100/90 transition hover:text-white">
          View All
          <span aria-hidden="true">&rsaquo;</span>
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {onlineMembers.map((member) => (
          <OnlineUserRow key={member.id} member={member} />
        ))}

        {onlineMembers.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-5 text-sm text-white/45">
            No members online right now.
          </div>
        )}
      </div>
    </section>
  );
}

function OnlineUserRow({ member }: { member: ServerMember }) {
  const isOwner = member.role === ServerMemberRole.OWNER;

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.035] px-3 py-3">
      <Avatar
        src={member.avatar}
        fallback={member.username}
        status={member.status}
        size="lg"
        userId={member.userId}
      />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-extrabold text-white">{member.username}</p>
          {isOwner && <Crown size={16} className="shrink-0 fill-violet-400 text-violet-300" />}
        </div>
        <p className="mt-1 text-xs capitalize text-white/75">{member.status}</p>
      </div>

      <span className="rounded-full border border-violet-400/20 bg-violet-500/15 px-4 py-1.5 text-xs font-bold capitalize text-violet-200">
        {isOwner ? "Owner" : member.role}
      </span>
    </div>
  );
}

function StatValue({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "emerald" | "violet" | "blue";
}) {
  const toneClass = {
    emerald: "text-emerald-300 shadow-emerald-500/10",
    violet: "text-violet-300 shadow-violet-500/10",
    blue: "text-blue-300 shadow-blue-500/10",
  }[tone];

  return (
    <div className="flex min-h-[126px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-2 text-center shadow-inner">
      <div className={toneClass}>{icon}</div>
      <p className="mt-4 text-3xl font-black leading-none text-white">{value}</p>
      <p className="mt-2 text-sm text-white">{label}</p>
    </div>
  );
}
