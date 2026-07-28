import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../../auth/context/useAuth";
import { useConversationMessages } from "../hooks/useConversationMessages";
import MessageBubble from "./MessageBubble";
import { useAutoScroll } from "../hooks/useAutoScroll";
import ChatMessagesSkeleton from "./ChatMessageSkeleton";
import EmptyMessagesState from "./EmptyMessagesState";
import { useMarkConversationRead } from "../hooks/useMarkConversationRead";

interface ChatMessagesProps {
    conversationId: string;
    isDirectConversation: boolean;
}

export default function ChatMessages({
    conversationId,
    isDirectConversation,
}: ChatMessagesProps) {
    const { data, isLoading } = useConversationMessages(conversationId);
    const { user } = useAuth();

    const messages = useMemo(
        () =>
            data?.messages.map((message) => ({
                ...message,
                isOwnMessage:
                    message.isOwnMessage || message.senderId === user?.id,
            })) ?? [],
        [data?.messages, user?.id]
    );

    const bottomRef = useAutoScroll(messages);
    const lastMarkedMessageIdRef = useRef<string | null>(null);
    

    const {
        mutate: markConversationRead,
        isPending: markingRead,
    } = useMarkConversationRead();

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
            }
        );
    }, [
        conversationId,
        messages,
        markConversationRead,
        markingRead,
    ]);

    if (isLoading) {
        return <ChatMessagesSkeleton />;
    }

    if (!isLoading && messages.length === 0) {
        return <EmptyMessagesState />;
    }

    return (
        <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-6 no-scrollbar">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    isDirectConversation={isDirectConversation}
                    showSenderInfo={!isDirectConversation}
                />
            ))}

            <div ref={bottomRef} />
        </div>
    );
}