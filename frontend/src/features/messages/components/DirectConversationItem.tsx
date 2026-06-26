import Avatar from "../../../shared/ui/Avatar";
import Badge from "../../../shared/ui/Badge";
import { cn } from "../../../shared/utils/cn";
import type { DirectConversation } from "../types/conversation.types";

interface DirectConversationItemProps {
    conversation: DirectConversation;
    active?: boolean;
    onClick: () => void;
}

export default function DirectConversationItem({
    conversation,
    active = false,
    onClick,
}: DirectConversationItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-all",
                active
                    ? "border-white/10 bg-white/10"
                    : "hover:border-white/5 hover:bg-white/5"
            )}
        >
            <Avatar
                src={conversation.avatar}
                fallback={conversation.username}
                status={conversation.presence}
                size="md"
            />

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                        {conversation.username}
                    </p>

                    {conversation.lastMessageAt && (
                        <span className="shrink-0 text-[10px] text-white/30">
                            {new Date(conversation.lastMessageAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    )}
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-white/40">
                        {conversation.isTyping
                            ? "Typing..."
                            : conversation.lastMessage || "Start chatting"}
                    </p>

                    {conversation.unreadCount > 0 && (
                        <Badge
                            variant="primary"
                            className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px]"
                        >
                            {conversation.unreadCount}
                        </Badge>
                    )}
                </div>
            </div>
        </button>
    );
}