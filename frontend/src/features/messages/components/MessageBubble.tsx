import { cn } from "../../../shared/utils/cn";
import type { MessageItem } from "../types/message.types";

interface MessageBubbleProps {
    message: MessageItem;
}

export default function MessageBubble({
    message,
}: MessageBubbleProps) {
    return (
        <div
            className={cn(
                "flex w-full",
                message.isOwnMessage
                    ? "justify-end"
                    : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3",
                    message.isOwnMessage
                        ? "bg-indigo-600"
                        : "bg-white/5"
                )}
            >
                <p className="break-words text-sm">
                    {message.deletedAt
                        ? "Message deleted"
                        : message.content}
                </p>

                <div className="mt-2 flex justify-end gap-1 text-[10px] text-white/40">
                    {message.editedAt && <span>edited</span>}

                    <span>
                        {new Date(
                            message.createdAt
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}