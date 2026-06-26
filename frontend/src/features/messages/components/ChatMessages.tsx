import { useConversationMessages } from "../hooks/useConversationMessages";
import MessageBubble from "./MessageBubble";
import { useAutoScroll } from "../hooks/useAutoScroll";
import ChatMessagesSkeleton from "./ChatMessageSkeleton";
import EmptyMessagesState from "./EmptyMessagesState";

interface ChatMessagesProps {
    conversationId: string;
}

export default function ChatMessages({
    conversationId,
}: ChatMessagesProps) {
    const {data, isLoading} = useConversationMessages(conversationId);
    const bottomRef = useAutoScroll(data?.messages);

    if (isLoading) {
        return <ChatMessagesSkeleton />
    }

    if(!isLoading && data?.messages.length === 0) {
        return <EmptyMessagesState />
    }

    return (
        <div className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto p-6 no-scrollbar">
            {data?.messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}