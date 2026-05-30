import ChannelSidebar from "../components/ChannelSidebar";
import ChannelMainPane from "../components/ChannelMainPane";
import OnlineMembersSidebar from "../../servers/core/components/dashboard/OnlineMembersSidebar";
import type { Server } from "../../servers/core/types";
import type { Channel } from "../types";

interface Props {
  server: Server;
  members: Server["members"];
  channels: Channel[];
  selectedChannel: Channel;
  canManageChannels: boolean;
  onSelectChannel: (channel: Channel) => void;
  onCreateClick: (type: Channel["type"]) => void;
  onServerHomeClick: () => void;
  onRenameClick: (channel: Channel) => void;
  onDeleteClick: (channel: Channel) => void;
}

export default function ChannelPage({
  server,
  members,
  channels,
  selectedChannel,
  canManageChannels,
  onSelectChannel,
  onCreateClick,
  onServerHomeClick,
  onRenameClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-[#070A12] text-white">
      <ChannelSidebar
        server={server}
        channels={channels}
        selectedChannelId={selectedChannel.id}
        canManageChannels={canManageChannels}
        onSelectChannel={onSelectChannel}
        onCreateClick={onCreateClick}
        onServerHomeClick={onServerHomeClick}
        onRenameClick={onRenameClick}
        onDeleteClick={onDeleteClick}
      />

      <ChannelMainPane channel={selectedChannel} />
      <OnlineMembersSidebar members={members ?? []} />
    </div>
  );
}