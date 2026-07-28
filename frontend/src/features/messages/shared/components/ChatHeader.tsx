import { useState } from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import Avatar from "../../../../shared/ui/Avatar";
import type { DirectConversation } from "../../direct/types/conversation.types";
import type { GroupConversation } from "../../group/types/group.types";
import GroupInfoModal from "../../group/components/GroupInfoModal";

interface ChatHeaderProps {
    conversation: DirectConversation | GroupConversation;
}

export default function ChatHeader({
    conversation,
}: ChatHeaderProps) {
    const [groupInfoOpen, setGroupInfoOpen] = useState(false);

    const isDirectConversation = (
        conversation: DirectConversation | GroupConversation
    ): conversation is DirectConversation => {
        return "username" in conversation;
    };

    const direct = isDirectConversation(conversation);

    return (
        <>
            <div className="flex h-16 items-center justify-between border-b border-white/5 bg-[#090B11] px-6">
                <button
                    type="button"
                    onClick={() => {
                        if (!direct) {
                            setGroupInfoOpen(true);
                        }
                    }}
                    className="flex min-w-0 items-center gap-3 rounded-xl text-left transition hover:bg-white/5"
                >
                    <Avatar
                        src={conversation.avatar}
                        fallback={direct ? conversation.username : conversation.name}
                        status={direct ? conversation.presence : undefined}
                        size="md"
                    />

                    <div className="min-w-0">
                        <p className="truncate font-semibold">
                            {direct ? conversation.username : conversation.name}
                        </p>

                        <p className="text-xs text-white/40 capitalize">
                            {direct
                                ? conversation.presence
                                : `${conversation.participantIds.length} members`}
                        </p>
                    </div>
                </button>

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

            {!direct && (
                <GroupInfoModal
                    isOpen={groupInfoOpen}
                    group={conversation}
                    onClose={() => setGroupInfoOpen(false)}
                />
            )}
        </>
    );
}