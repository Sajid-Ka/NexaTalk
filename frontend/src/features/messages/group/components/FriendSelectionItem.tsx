import Avatar from "../../../../shared/ui/Avatar";
import { Check } from "lucide-react";
import { cn } from "../../../../shared/utils/cn";
import type { Friend } from "../../../friends/types/friend.types";

interface FriendSelectionItemProps {
    friend: Friend
    selected: boolean;
    onToggle: () => void;
}

export default function FriendSelectionItem({
    friend,
    selected,
    onToggle,
}: FriendSelectionItemProps) {
    return (
        <button
            onClick={onToggle}
            className={cn(
                "flex w-full items-center justify-between rounded-xl border border-transparent p-3 transition",
                selected
                    ? "border-indigo-500/40 bg-indigo-500/10"
                    : "hover:border-white/5 hover:bg-white/5"
            )}
        >
            <div className="flex items-center gap-3">
                <Avatar
                    src={friend.friend.avatar}
                    fallback={friend.friend.username}
                    status={friend.friend.status}
                    size="md"
                />

                <span className="font-medium">
                    {friend.friend.username}
                </span>
            </div>

            <div
                className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border transition",
                    selected
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-white/20"
                )}
            >
                {selected && (
                    <Check size={15} />
                )}
            </div>
        </button>
    );
}