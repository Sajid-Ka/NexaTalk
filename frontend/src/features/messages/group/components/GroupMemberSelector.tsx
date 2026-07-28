import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Input from "../../../../shared/ui/Input";
import EmptyState from "../../../../shared/ui/EmptyState";
import FriendSelectionItem from "./FriendSelectionItem";
import SelectedMembers from "./SelectedMembers";
import useFriends from "../../../friends/hooks/useFriends";
import { FriendshipStatus } from "../../../../shared/constants/friend.const";

interface GroupMemberSelectorProps {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    excludeIds?: string[];
}

export default function GroupMemberSelector({
    selectedIds,
    onChange,
    excludeIds = [],
}: GroupMemberSelectorProps) {
    const { friends, loading : isLoading } = useFriends( { status : FriendshipStatus.ACCEPTED });

    const [search, setSearch] = useState("");

    const filteredFriends = useMemo(() => {
        return friends.filter((friend) => {
            const friendId = friend.friend.id;

            return (
                !excludeIds.includes(friendId) &&
                friend.friend.username
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        });
    }, [friends, search, excludeIds]);

    const selectedFriends = useMemo(() => {
        return friends.filter((friend) =>
            selectedIds.includes(friend.friend.id)
        );
    }, [friends, selectedIds]);

    const toggleFriend = (id: string) => {

        if (selectedIds.includes(id)) {

            onChange(
                selectedIds.filter(x => x !== id)
            );

            return;
        }

        onChange([
            ...selectedIds,
            id,
        ]);
    };

    return (
        <div className="space-y-5">

            <div className="relative">

                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                />

                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search friends..."
                    className="pl-11"
                />

            </div>
            {selectedFriends.length > 0 && (
                <SelectedMembers
                    friends={selectedFriends}
                    onRemove={toggleFriend}
                />
            )}

            <div className="max-h-72 space-y-2 overflow-y-auto">

                {!isLoading &&
                    filteredFriends.length === 0 && (

                        <EmptyState
                            icon={Search}
                            title="No friends found"
                            description="Try another search."
                        />

                    )}

                {filteredFriends.map(friend => (

                    <FriendSelectionItem
                        key={friend.friend.id}
                        friend={friend}
                        selected={selectedIds.includes(friend.friend.id)}
                        onToggle={() =>
                            toggleFriend(friend.friend.id)
                        }
                    />

                ))}

            </div>

        </div>
    );
}