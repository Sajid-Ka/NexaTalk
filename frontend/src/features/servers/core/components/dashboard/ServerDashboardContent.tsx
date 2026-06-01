import { useEffect, useMemo, useState } from "react";
import { Hash, Lock, Plus, Settings, Share2, Users, Volume2, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import type { Server } from "../../types";
import UserStatusFooter from "../../../../home/components/UserStatusFooter";


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
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
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
        setSelectedChannel(null);

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
      setSelectedChannel(createdChannel);
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

      setSelectedChannel((current) =>
        current?.id === updatedChannel.id ? updatedChannel : current,
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

      setSelectedChannel((current) =>
        current?.id === deleteModal.channel?.id ? null : current,
      );

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
          onSelectChannel={setSelectedChannel}
          onCreateClick={openCreateModal}
          onServerHomeClick={() => setSelectedChannel(null)}
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
    <div className="flex min-h-0 flex-1 overflow-hidden bg-[#070A12] text-white">

      <main className="min-w-0 flex-1 overflow-y-auto">
        <ServerHomePane
          server={server}
          channels={channels}
          onlineCount={onlineMembers.length}
          loadingChannels={loadingChannels}
          canManageChannels={canManageChannels}
          onSelectChannel={setSelectedChannel}
          onCreateClick={openCreateModal}
          onSettingsClick={() => navigate(`/servers/${server.id}/settings`)}
        />
      </main>

      <div className="absolute bottom-0 left-0 z-30 w-60 border-r border-white/5">
        <UserStatusFooter />
    </div>

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

  return (
    <div className="min-h-full bg-[#070A12]">
      <section className="border-b border-white/10 bg-gradient-to-br from-indigo-950/80 via-[#0E1220] to-emerald-950/40 px-8 pb-8 pt-6">
        <div className="mb-20 flex justify-end gap-3">
          <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white/85 hover:bg-white/10">
            <Share2 size={15} />
            Invite
          </button>

          <button
            onClick={onSettingsClick}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-white/85 hover:bg-white/10"
          >
            <Settings size={15} />
            Settings
          </button>
        </div>

        <div className="flex items-end gap-5">
          <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-[#070A12] bg-[#111827] text-4xl font-black text-cyan-300 shadow-xl">
            {server.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-5xl font-black text-white">{server.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase text-white">
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
                {server.memberCount} members
              </span>
            </div>

            {server.description && (
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/75">
                {server.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 px-8 py-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          {canManageChannels && (
            <div className="flex w-full flex-wrap justify-center gap-3">
              <button
                onClick={() => onCreateClick(ChannelType.TEXT)}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-500 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600"
              >
                <Plus size={17} />
                Create Text Channel
              </button>

              <button
                onClick={() => onCreateClick(ChannelType.VOICE)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 text-sm font-bold text-cyan-100 hover:bg-cyan-400/15"
              >
                <Plus size={17} />
                Create Voice Channel
              </button>
            </div>
          )}

          {loadingChannels ? (
            <p className="text-sm text-white/45">Loading channels...</p>
          ) : (
            <>
              <ChannelCardSection
                title="Text Channels"
                emptyText="No text channels yet."
                channels={textChannels}
                type={ChannelType.TEXT}
                onSelectChannel={onSelectChannel}
              />

              <ChannelCardSection
                title="Voice Channels"
                emptyText="No voice channels yet."
                channels={voiceChannels}
                type={ChannelType.VOICE}
                onSelectChannel={onSelectChannel}
              />
            </>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
              Server Stats
            </p>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <StatValue label="Online" value={onlineCount} />
              <StatValue label="Members" value={server.memberCount} />
              <StatValue label="Channels" value={channels.length} />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

interface ChannelCardSectionProps {
  title: string;
  emptyText: string;
  channels: Channel[];
  type: ChannelTypeValue;
  onSelectChannel: (channel: Channel) => void;
}

function ChannelCardSection({
  title,
  emptyText,
  channels,
  type,
  onSelectChannel,
}: ChannelCardSectionProps) {
  const Icon = type === ChannelType.TEXT ? Hash : Volume2;

  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/45">
        {title}
      </h2>

      {channels.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/45">
          {emptyText}
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-max grid-flow-col auto-cols-[220px] gap-3 xl:grid-flow-row xl:grid-cols-4 xl:auto-cols-auto 2xl:grid-cols-5">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                className="flex h-20 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-left transition hover:border-indigo-400/50 hover:bg-white/[0.09]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-200">
                  <Icon size={18} />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-white">
                    {type === ChannelType.TEXT ? `# ${channel.name}` : channel.name}
                  </span>
                  <span className="mt-1 block text-xs text-white/40">
                    {type === ChannelType.TEXT ? "Text channel" : "Voice channel"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function StatValue({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs text-white/45">{label}</p>
    </div>
  );
}
