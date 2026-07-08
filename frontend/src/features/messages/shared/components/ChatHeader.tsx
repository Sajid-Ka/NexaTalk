import { Phone, Video, MoreVertical } from "lucide-react";
import Avatar from "../../../../shared/ui/Avatar";
import type { DirectConversation } from "../../direct/types/conversation.types";
import type { GroupConversation } from "../../group/types/group.types";

interface ChatHeaderProps {
    conversation: DirectConversation | GroupConversation;
}



export default function ChatHeader({
    conversation,
}: ChatHeaderProps) {

    const isDirectConversation = (
        conversation: DirectConversation | GroupConversation
    ): conversation is DirectConversation => {
        return "username" in conversation;
    };

    return (
        <div className="flex h-16 items-center justify-between border-b border-white/5 bg-[#090B11] px-6">
            <div className="flex items-center gap-3">
                <Avatar
                    src={conversation.avatar}
                    fallback={isDirectConversation(conversation) ? conversation.username : conversation.name}
                    status={isDirectConversation(conversation) ? conversation.presence : undefined}
                    size="md"
                />

                <div>
                    <p className="font-semibold">
                        {isDirectConversation(conversation) ? conversation.username : conversation.name}
                    </p>

                    <p className="text-xs text-white/40 capitalize">
                        {isDirectConversation(conversation) ? conversation.presence : `${conversation.participantIds.length} members`}
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