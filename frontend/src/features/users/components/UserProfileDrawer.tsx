import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, MessageSquare, Phone, ShieldBan, UserMinus, UserPlus } from "lucide-react";
import { closeProfileDrawer } from "../store/userProfileDrawerSlice";
import type { RootState } from "../../../app/store";
import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";
import { getProfileByIdApi } from "../../settings/settingsFeat/profile/api/profileApi";
import type { ProfileResponse } from "../../settings/settingsFeat/profile/api/profileApi";
import { getFriendsApi, getBlockedUsersApi, sendFriendRequestApi, unblockUserApi } from "../../friends/api/friendApi";
import type { Friend, BlockedUserResponse } from "../../friends/types/friend.types";
import { UserPresence } from "../../../shared/constants/user.const";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import BlockConfirmationModal from "../../friends/components/BlockConfirmationModal";
import RemoveFriendConfirmationModal from "../../friends/components/RemoveFriendConfirmationModal";

export default function UserProfileDrawer() {
  const dispatch = useDispatch();
  const { isOpen, selectedUserId } = useSelector((state: RootState) => state.userProfileDrawer);
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  // Fetch user profile
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", selectedUserId],
    queryFn: () => getProfileByIdApi(selectedUserId!),
    enabled: !!selectedUserId && isOpen,
  });

  // Fetch friends to check relationship
  const { data: friendsData } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriendsApi({ status: "accepted" }),
    enabled: isOpen,
  });

  // Fetch blocked to check relationship
  const { data: blockedData } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsersApi,
    enabled: isOpen,
  });

  if (!isOpen || !selectedUserId) return null;

  const profile = profileData?.data?.data as ProfileResponse | undefined;
  
  const friends = friendsData?.data?.data?.friends || [];
  const blockedUsers = blockedData?.data?.data || [];
  
  const isFriend = friends.some((f: Friend) => f.friend.id === selectedUserId);
  const isBlocked = blockedUsers.some((b: BlockedUserResponse) => b.userId === selectedUserId);
  
  const handleAddFriend = async () => {
    try {
      await sendFriendRequestApi({ friendId: selectedUserId });
      toast.success("Friend request sent");
    } catch {
      toast.error("Failed to send request");
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockUserApi(selectedUserId);
      toast.success("User unblocked");
      dispatch(closeProfileDrawer());
    } catch {
      toast.error("Failed to unblock user");
    }
  };

  if (isLoadingProfile) {
    return (
      <aside className="w-[340px] flex flex-col bg-[#090B11] p-4 shrink-0 border-l border-white/5 overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Profile</h2>
          <button onClick={() => dispatch(closeProfileDrawer())} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center p-8">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      </aside>
    );
  }

  if (!profile) return null;

  return (
    <aside className="w-[340px] flex flex-col bg-[#090B11] p-4 shrink-0 border-l border-white/5 overflow-y-auto no-scrollbar relative">
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold text-white">Profile</h2>
        <button onClick={() => dispatch(closeProfileDrawer())} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <X size={20} className="text-white/70 hover:text-white" />
        </button>
      </div>

      <div className="flex flex-col items-center mt-4">
        <Avatar src={profile.avatar} fallback={profile.username} size="xl" status={profile.status as UserPresence} />
        <h3 className="mt-4 text-xl font-bold text-white">{profile.username}</h3>
        {profile.bio && (
          <p className="mt-2 text-sm text-center text-white/60 px-4">{profile.bio}</p>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {isFriend && !isBlocked && (
          <>
            <div className="flex gap-3">
              <Button className="flex-1 bg-indigo-600 opacity-50 cursor-not-allowed text-xs">
                <MessageSquare size={16} className="mr-2" /> Message
              </Button>
              <Button className="flex-1 bg-indigo-600 opacity-50 cursor-not-allowed text-xs">
                <Phone size={16} className="mr-2" /> Call
              </Button>
            </div>
            <div className="pt-4 border-t border-white/5 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-300 border-none"
                onClick={() => setShowBlockModal(true)}
              >
                <ShieldBan size={16} className="mr-3" /> Block User
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-300 border-none"
                onClick={() => setShowRemoveModal(true)}
              >
                <UserMinus size={16} className="mr-3" /> Remove Friend
              </Button>
            </div>
          </>
        )}

        {!isFriend && !isBlocked && (
          <>
            <Button className="w-full bg-indigo-600" onClick={handleAddFriend}>
              <UserPlus size={16} className="mr-2" /> Add Friend
            </Button>
            <div className="pt-4 border-t border-white/5 space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-300 border-none"
                onClick={() => setShowBlockModal(true)}
              >
                <ShieldBan size={16} className="mr-3" /> Block User
              </Button>
            </div>
          </>
        )}

        {isBlocked && (
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-none" onClick={handleUnblock}>
            <ShieldBan size={16} className="mr-2" /> Unblock User
          </Button>
        )}
      </div>

      {showBlockModal && (
        <BlockConfirmationModal 
          isOpen={showBlockModal} 
          onClose={() => setShowBlockModal(false)}
          userId={selectedUserId}
          username={profile.username}
        />
      )}
      
      {showRemoveModal && (
        <RemoveFriendConfirmationModal 
          isOpen={showRemoveModal} 
          onClose={() => setShowRemoveModal(false)}
          userId={selectedUserId}
          username={profile.username}
        />
      )}
    </aside>
  );
}
