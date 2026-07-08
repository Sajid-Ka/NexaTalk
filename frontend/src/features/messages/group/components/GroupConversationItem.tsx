import Avatar from "../../../../shared/ui/Avatar";
import { cn } from "../../../../shared/utils/cn";
import type { GroupConversation } from "../types/group.types";

interface GroupConversationItemProps {
    group: GroupConversation;
    active?: boolean;
    onClick: () => void;
}

export default function GroupConversationItem({
    group,
    active = false,
    onClick,
}: GroupConversationItemProps) {

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
                src={group.avatar}
                fallback={group.name}
                size="md"
            />

            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">
                        {group.name}
                    </p>

                    {group.updatedAt && (
                        <span className="shrink-0 text-[10px] text-white/30">
                            {new Date(group.updatedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    )}
                </div>

                <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-white/40">
                        {group.lastMessage ?? "No messages yet"}
                    </p>
                </div>
            </div>
        </button>
    );
}