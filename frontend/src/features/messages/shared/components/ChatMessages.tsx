import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../../auth/context/useAuth";
import { useConversationMessages } from "../hooks/useConversationMessages";
import MessageBubble from "./MessageBubble";
import { useAutoScroll } from "../hooks/useAutoScroll";
import ChatMessagesSkeleton from "./ChatMessageSkeleton";
import EmptyMessagesState from "./EmptyMessagesState";
import { useMarkConversationRead } from "../hooks/useMarkConversationRead";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import type { ServerMember } from "../../../servers/core/types";
import type { MessageItem } from "../types/message.types";

interface ChatMessagesProps {
  conversationId: string;
  isDirectConversation: boolean;
  serverMembers?: ServerMember[];
}

export default function ChatMessages({
  conversationId,
  isDirectConversation,
  serverMembers,
}: ChatMessagesProps) {
  const { data, isLoading } = useConversationMessages(conversationId);
  const { user } = useAuth();

  const messages = useMemo(
    () =>
      data?.messages.map((message) => ({
        ...message,
        isOwnMessage: message.isOwnMessage || message.senderId === user?.id,
      })) ?? [],
    [data?.messages, user?.id],
  );

  const bottomRef = useAutoScroll(messages);
  const lastMarkedMessageIdRef = useRef<string | null>(null);

  const { mutate: markConversationRead, isPending: markingRead } = useMarkConversationRead();

  useEffect(() => {
    lastMarkedMessageIdRef.current = null;
  }, [conversationId]);

  useEffect(() => {
    if (!messages.length || markingRead) {
      return;
    }

    const latestIncomingMessage = [...messages]
      .reverse()
      .find((message) => !message.isOwnMessage && !message.deletedAt);

    if (!latestIncomingMessage) {
      return;
    }

    if (lastMarkedMessageIdRef.current === latestIncomingMessage.id) {
      return;
    }

    lastMarkedMessageIdRef.current = latestIncomingMessage.id;

    markConversationRead(
      {
        conversationId,
        messageId: latestIncomingMessage.id,
      },
      {
        onError: () => {
          lastMarkedMessageIdRef.current = null;
        },
      },
    );
  }, [conversationId, messages, markConversationRead, markingRead]);

  if (isLoading) {
    return <ChatMessagesSkeleton />;
  }

  if (!isLoading && messages.length === 0) {
    return <EmptyMessagesState />;
  }

  const canDeleteServerMessage = (message: MessageItem) => {
    if (!serverMembers || message.isOwnMessage) {
      return false;
    }

    const currentMember = serverMembers.find((member) => member.userId === user?.id);

    if (!currentMember) {
      return false;
    }

    const senderMember = serverMembers.find((member) => member.userId === message.senderId);
    const senderRole = senderMember?.role ?? ServerMemberRole.MEMBER;

    if (currentMember.role === ServerMemberRole.OWNER) {
      return true;
    }

    if (currentMember.role === ServerMemberRole.ADMIN) {
      return senderRole !== ServerMemberRole.OWNER;
    }

    return false;
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-6 no-scrollbar">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isDirectConversation={isDirectConversation}
          showSenderInfo={!isDirectConversation}
          canDeleteForEveryone={canDeleteServerMessage(message)}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
