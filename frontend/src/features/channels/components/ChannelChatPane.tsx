import { Hash } from "lucide-react";
import ChatInput from "../../messages/shared/components/ChatInput";
import ChatMessages from "../../messages/shared/components/ChatMessages";
import { useChannelConversation } from "../hooks/useChannelConversation";
import type { Channel } from "../types";
import type { ServerMember } from "../../servers/core/types";

interface ChannelChatPaneProps {
  serverId: string;
  channel: Channel;
  members: ServerMember[];
}

export default function ChannelChatPane({ serverId, channel, members }: ChannelChatPaneProps) {
  const {
    data: conversation,
    isLoading,
    isError,
    refetch,
  } = useChannelConversation(serverId, channel.id);

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#111214]">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Hash size={20} className="shrink-0 text-white/45" />
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold text-white">{channel.name}</h1>
            <p className="truncate text-xs text-white/35">The main hub for #{channel.name}</p>
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center px-6 text-sm text-white/45">
          Opening #{channel.name}...
        </div>
      )}

      {isError && (
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-bold text-white">Could not open this channel</h2>
            <p className="mt-2 text-sm leading-6 text-white/45">
              Check that you are still a member of this server and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {conversation && (
        <>
          <ChatMessages
            conversationId={conversation.id}
            isDirectConversation={false}
            serverMembers={members}
          />
          <ChatInput conversationId={conversation.id} placeholder={`Message #${channel.name}`} />
        </>
      )}
    </main>
  );
}
