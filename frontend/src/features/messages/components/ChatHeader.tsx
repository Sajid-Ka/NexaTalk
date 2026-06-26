import { Phone, Video, MoreVertical } from "lucide-react";
import Avatar from "../../../shared/ui/Avatar";
import type { DirectConversation } from "../types/conversation.types";

interface ChatHeaderProps {
    conversation: DirectConversation;
}

export default function ChatHeader({
    conversation,
}: ChatHeaderProps) {
    return (
        <div className="flex h-16 items-center justify-between border-b border-white/5 bg-[#090B11] px-6">
            <div className="flex items-center gap-3">
                <Avatar
                    src={conversation.avatar}
                    fallback={conversation.username}
                    status={conversation.presence}
                    size="md"
                />

                <div>
                    <p className="font-semibold">
                        {conversation.username}
                    </p>

                    <p className="text-xs text-white/40 capitalize">
                        {conversation.presence}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="rounded-lg p-2 transition hover:bg-white/5">
                    <Phone size={18} />
                </button>

                <button className="rounded-lg p-2 transition hover:bg-white/5">
                    <Video size={18} />
                </button>

                <button className="rounded-lg p-2 transition hover:bg-white/5">
                    <MoreVertical size={18} />
                </button>
            </div>
        </div>
    );
}