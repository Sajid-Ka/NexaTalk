import { useState, useEffect, useCallback } from "react";
import Avatar from "../../../../../shared/ui/Avatar";
import Button from "../../../../../shared/ui/Button";
import { X, MessageSquare, UserPlus } from "lucide-react";
import { getProfileByIdApi } from "../api/profileApi";
import { UserPresence } from "../../../../../shared/constants/user.const";

interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: UserPresence;
  globalRole: string;
  lastSeenAt?: string;
  isProfilePublic: boolean;
  interests?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface ProfilePopupProps {
  userId: string;
  onClose: () => void;
  position?: { x: number; y: number };
  hideMessageButton?: boolean;
  onAddFriend?: (userId: string) => void;
  isSendingFriendRequest?: boolean;
}


// Simple function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

export default function ProfilePopup({
  userId,
  onClose,
  position,
  hideMessageButton,
  onAddFriend,
  isSendingFriendRequest
}: ProfilePopupProps) {

  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Define fetchProfile BEFORE using it in useEffect
  const fetchProfile = useCallback(async () => {
    try {
      const res = await getProfileByIdApi(userId);
      setProfile(res.data.data as ProfileResponse);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="bg-[#1A1D2D] rounded-2xl shadow-2xl border border-white/10 p-6 w-80">
        <div className="animate-pulse space-y-4">
          <div className="h-16 w-16 bg-white/10 rounded-full mx-auto" />
          <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
          <div className="h-3 bg-white/10 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

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

  return (
    <div
      className="absolute z-50 bg-[#1A1D2D] rounded-2xl shadow-2xl border border-white/10 w-80 overflow-hidden"
      style={position ? { top: position.y, left: position.x } : {}}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 transition-colors z-10"
      >
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
            {profile.interests.slice(0, 3).map((interest: { id: string; name: string }) => (
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
        <div className="flex gap-2 mt-4">
          {!hideMessageButton && (
            <Button size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-sm py-2">
              <MessageSquare size={14} className="mr-1" />
              Message
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={onAddFriend ? () => onAddFriend(profile.id) : undefined}
            isLoading={isSendingFriendRequest}
          >
            <UserPlus size={14} className="mr-1" />
            Add Friend
          </Button>
        </div>
      </div>
    </div>
  );
}