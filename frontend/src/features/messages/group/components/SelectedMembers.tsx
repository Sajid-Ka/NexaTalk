import { X } from "lucide-react";
import type { Friend } from "../../../friends/types/friend.types";

interface SelectedMembersProps {

    friends: Friend[];

    onRemove: (id: string) => void;

}

export default function SelectedMembers({
    friends,
    onRemove,
}: SelectedMembersProps) {

    if (!friends.length) {
        return null;
    }

    return (

        <div className="space-y-2">

            <p className="text-sm font-medium text-white/70">
                Selected
            </p>

            <div className="flex flex-wrap gap-2">

                {friends.map(friend => (

                    <button
                        key={friend.friend.id}
                        onClick={() =>
                            onRemove(friend.friend.id)
                        }
                        className="flex items-center gap-2 rounded-full bg-indigo-600/20 px-3 py-1 text-sm transition hover:bg-indigo-600/30"
                    >
                        {friend.friend.username}

                        <X size={14} />

                    </button>

                ))}

            </div>

        </div>

    );
}