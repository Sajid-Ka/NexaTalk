import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X, UserPlus, UserMinus, ShieldBan } from "lucide-react";
import toast from "react-hot-toast";

import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";
import { getUserPreviewApi } from "../../settings/settingsFeat/profile/api/profileApi";
import { UserRelationship } from "../../../shared/constants/relationship.const";
import { sendFriendRequestApi, unblockUserApi } from "../api/friendApi";
import BlockConfirmationModal from "./BlockConfirmationModal";
import RemoveFriendConfirmationModal from "./RemoveFriendConfirmationModal";
import { UserPresence } from "../../../shared/constants/user.const";
import { useAuth } from "../../auth/context/useAuth";

interface UserPreviewModalProps {
  userId: string;
  onClose: () => void;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

export default function UserPreviewModal({ userId, onClose }: UserPreviewModalProps) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  // Safeguard: Prevent opening for current user
  useEffect(() => {
    if (userId === currentUserId) {
      onClose();
    }
  }, [userId, currentUserId, onClose]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userPreview", userId],
    queryFn: () => getUserPreviewApi(userId),
    enabled: !!userId && userId !== currentUserId,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-[#1A1D2D] rounded-2xl shadow-2xl border border-white/10 p-6 w-80" onClick={(e) => e.stopPropagation()}>
          <div className="animate-pulse space-y-4">
            <div className="h-16 w-16 bg-white/10 rounded-full mx-auto" />
            <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
            <div className="h-3 bg-white/10 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) return null;

  const { user: profile, relationship } = data.data.data;

  const handleAddFriend = async () => {
    setIsSendingRequest(true);
    try {
      await sendFriendRequestApi({ friendId: userId });
      toast.success("Friend request sent");
      
      // Invalidate queries to refresh background search/recommendations
      queryClient.invalidateQueries({ queryKey: ["friend-search"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-users"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });

      onClose();
    } catch {
      toast.error("Failed to send request");
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockUserApi(userId);
      toast.success("User unblocked");
      
      queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
      queryClient.invalidateQueries({ queryKey: ["friend-search"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-users"] });
      
      onClose();
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  const statusColors: Record<UserPresence, string> = {
    [UserPresence.ONLINE]: "bg-emerald-500",
    [UserPresence.IDLE]: "bg-yellow-500",
    [UserPresence.OFFLINE]: "bg-gray-500",
    [UserPresence.DND]: "bg-red-500",
  };

  const statusText: Record<UserPresence, string> = {
    [UserPresence.ONLINE]: "Online",
    [UserPresence.IDLE]: "Idle",
    [UserPresence.OFFLINE]: "Offline",
    [UserPresence.DND]: "Do Not Disturb",
  };

  const handleActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    queryClient.invalidateQueries({ queryKey: ["friend-search"] });
    queryClient.invalidateQueries({ queryKey: ["recommended-users"] });
    queryClient.invalidateQueries({ queryKey: ["blocked-users"] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-[#1A1D2D] rounded-2xl shadow-2xl border border-white/10 w-80 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors z-10">
          <X size={16} className="text-white/60" />
        </button>

        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-purple-600" />

        {/* Avatar */}
        <div className="px-4 -mt-10 mb-3">
          <Avatar
            src={profile.avatar}
            fallback={profile.username[0] || "U"}
            size="xl"
            className="w-20 h-20 rounded-full border-4 border-[#1A1D2D]"
          />
        </div>

        {/* User Info */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-white">{profile.username}</h3>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${statusColors[profile.status]}`} />
              <span className="text-xs text-white/60 capitalize">{statusText[profile.status]}</span>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-white/60 mt-2 line-clamp-2">{profile.bio}</p>
          )}

          <div className="mt-3 text-xs text-white/40">
            Joined {formatRelativeTime(profile.createdAt)}
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {profile.interests.slice(0, 3).map((interest) => (
                <span key={interest.id} className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-white/60">
                  {interest.name}
                </span>
              ))}
              {profile.interests.length > 3 && (
                <span className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-white/60">
                  +{profile.interests.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            {relationship === UserRelationship.STRANGER && (
              <>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleAddFriend} isLoading={isSendingRequest}>
                  <UserPlus size={16} className="mr-2" /> Add Friend
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-300 border-none" onClick={() => setShowBlockModal(true)}>
                  <ShieldBan size={16} className="mr-3" /> Block User
                </Button>
              </>
            )}

            {relationship === UserRelationship.FRIEND && (
              <>
                <Button variant="outline" className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-300 border-none" onClick={() => setShowRemoveModal(true)}>
                  <UserMinus size={16} className="mr-3" /> Remove Friend
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-300 border-none" onClick={() => setShowBlockModal(true)}>
                  <ShieldBan size={16} className="mr-3" /> Block User
                </Button>
              </>
            )}

            {relationship === UserRelationship.BLOCKED && (
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-none" onClick={handleUnblock}>
                <ShieldBan size={16} className="mr-2" /> Unblock User
              </Button>
            )}
          </div>
        </div>
      </div>

      {showBlockModal && (
        <BlockConfirmationModal 
          isOpen={showBlockModal} 
          onClose={() => {
            setShowBlockModal(false);
          }}
          onSuccess={handleActionSuccess}
          userId={userId}
          username={profile.username}
        />
      )}
      
      {showRemoveModal && (
        <RemoveFriendConfirmationModal 
          isOpen={showRemoveModal} 
          onClose={() => {
            setShowRemoveModal(false);
          }}
          onSuccess={handleActionSuccess}
          userId={userId}
          username={profile.username}
        />
      )}
    </div>
  );
}
