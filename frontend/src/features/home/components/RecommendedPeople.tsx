import { useState } from "react";
import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";
import { useRecommendedUsersQuery, useInvalidateRecommendations } from "../../recommendations/api/recommendationApi";
import { sendFriendRequestApi } from "../../friends/api/friendApi";
import toast from "react-hot-toast";

export default function RecommendedPeople() {
  const { data: users, isLoading, isError } = useRecommendedUsersQuery(5);
  const invalidateRecommendations = useInvalidateRecommendations();
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  if (isError) {
    return (
      <div className="px-4 py-3 opacity-60">
        <p className="text-xs text-white/40">Unable to load recommendations</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-2 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/10 rounded w-1/2" />
              <div className="h-2 bg-white/10 rounded w-3/4" />
            </div>
            <div className="w-16 h-6 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="px-4 py-3">
        <p className="text-xs text-white/50 text-center">Select more interests to discover people.</p>
      </div>
    );
  }

  const handleAddFriend = async (userId: string) => {
    try {
      setPendingIds((prev) => new Set(prev).add(userId));
      await sendFriendRequestApi({ friendId: userId });
      toast.success("Friend request sent");
      invalidateRecommendations();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message || "Failed to send request");
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  return (
    <div className="px-2 space-y-0.5">
      {users.map((user) => {
        const isPending = pendingIds.has(user.id);
        const displayInterests = user.mutualInterests.slice(0, 3).join(" • ") + (user.mutualInterests.length > 3 ? ` +${user.mutualInterests.length - 3}` : "");

        return (
          <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 group transition-colors">
            <Avatar
              src={user.avatar}
              fallback={user.username[0]}
              size="sm"
              status={user.isOnline ? "online" : "offline"}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.username}</p>
              <p className="text-[10px] text-white/40 truncate" title={user.mutualInterests.join(", ")}>
                {displayInterests}
              </p>
            </div>
            <Button
              size="sm"
              variant={isPending ? "secondary" : "primary"}
              className="h-6 px-2 text-[10px]"
              onClick={() => handleAddFriend(user.id)}
              disabled={isPending}
            >
              {isPending ? "Pending" : "Add"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
