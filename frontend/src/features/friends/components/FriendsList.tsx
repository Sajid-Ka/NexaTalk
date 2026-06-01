import { useState, useEffect, useCallback } from "react";
import {
  Users, Search, MessageSquare, Phone, UserPlus,
  Check, X, UserMinus
} from "lucide-react";
import Avatar from "../../../shared/ui/Avatar";
import Button from "../../../shared/ui/Button";
import { cn } from "../../../shared/utils/cn";
import { getFriendsApi, respondFriendRequestApi, removeFriendApi } from "../../friends/api/friendApi";
import type { Friend } from "../../friends/api/friendApi";
import { UserPresence } from "../../../shared/constants/user.const";
import AddFriendModal from "./AddFriendModal";
import toast from "react-hot-toast";
import { getPendingRequestsApi } from "../../friends/api/friendApi";
import { FriendTab } from "../../../shared/constants/friend.const";
import { AxiosError } from "axios";

// Define error response type
interface ApiErrorResponse {
  error?: {
    message?: string;
  };
  message?: string;
}

export default function FriendsList() {
  const [activeTab, setActiveTab] = useState<FriendTab>(FriendTab.ONLINE);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      let friendsData;

      if (activeTab === FriendTab.PENDING) {
        // Fetch pending requests (send and recieve)
        const [recievedRes, sentRes] = await Promise.all([
          getPendingRequestsApi("received"),
          getPendingRequestsApi("sent"),
        ])

        const receivedRequests = recievedRes.data.data;
        const sentRequests = sentRes.data.data;

        friendsData = {
          friends: [...receivedRequests, ...sentRequests],
          total: receivedRequests.length + sentRequests.length,
          online: 0,
          offline: 0,
        }
        setPendingCount(receivedRequests.length)
      } else if (activeTab === FriendTab.BLOCKED) {
        friendsData = {
          friends: [],
          total: 0,
          online: 0,
          offline: 0,
        };
      } else {
        const status = activeTab === FriendTab.ONLINE ? "accepted" : undefined;
        const res = await getFriendsApi({
          status,
          search: debouncedSearch || undefined,
        });
        friendsData = res.data.data;
      }

      setFriends(friendsData.friends);
    } catch {
      toast.error("Failed to load friends");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await getPendingRequestsApi("received");

      setPendingCount(res.data.data.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  const handleAcceptRequest = async (userId: string, requestId: string) => {
    setProcessing(requestId);
    try {
      await respondFriendRequestApi(userId, { status: "accepted" });
      toast.success("Friend request accepted");
      fetchFriends();
      fetchPendingCount()
    } catch (err) {
      let errorMessage = "Failed to accept request";
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        errorMessage = data?.error?.message || data?.message || "Failed to accept request";
      }
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectRequest = async (userId: string, requestId: string) => {
    setProcessing(requestId);
    try {
      await respondFriendRequestApi(userId, { status: "blocked" });
      toast.success("Friend request rejected");
      fetchFriends();
      fetchPendingCount()
    } catch (err) {
      let errorMessage = "Failed to reject request";
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        errorMessage = data?.error?.message || data?.message || "Failed to reject request";
      }
      toast.error(errorMessage);
    } finally {
      setProcessing(null);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await removeFriendApi(friendId);
      toast.success("Friend removed");
      fetchFriends();
    } catch (err) {
      let errorMessage = "Failed to remove friend";
      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        errorMessage = data?.error?.message || data?.message || "Failed to remove friend";
      }
      toast.error(errorMessage);
    }
  };

  const tabs = [
    { id: FriendTab.ONLINE, label: "Online" },
    { id: FriendTab.ALL, label: "All" },
    { id: FriendTab.PENDING, label: "Pending" },
    { id: FriendTab.BLOCKED, label: "Blocked" },
  ] as const;

  const filteredFriends = activeTab === FriendTab.ONLINE
    ? friends.filter(f => f.friend.status === UserPresence.ONLINE)
    : friends;

  const onlineCount = friends.filter(f => f.friend.status === UserPresence.ONLINE).length;

  // Helper function to get status text
  const getStatusText = (status: UserPresence) => {
    switch (status) {
      case UserPresence.ONLINE: return "Online";
      case UserPresence.IDLE: return "Idle";
      case UserPresence.DND: return "Do Not Disturb";
      default: return "Offline";
    }
  };

  const isReceivedPendingRequest = (friend: Friend) =>
    activeTab === FriendTab.PENDING && friend.friendId !== friend.friend.id;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Header */}
      <header className="h-12 px-4 flex items-center justify-between border-b border-white/5 bg-[#0F121D]/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white/50 border-r border-white/10 pr-4">
            <Users size={20} />
            <span className="font-bold text-sm text-white">Friends</span>
          </div>

          <nav className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                )}
              >
                {tab.label}
                {tab.id === FriendTab.ONLINE && onlineCount > 0 && (
                  <span className="ml-1 text-xs">({onlineCount})</span>
                )}
                {tab.id === FriendTab.PENDING && pendingCount > 0 && (
                  <span className="ml-1 text-xs text-violet-500">({pendingCount})</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <Button
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 rounded-lg text-xs h-8 px-4 border-none font-bold flex items-center gap-1"
        >
          <UserPlus size={14} />
          Add Friend
        </Button>
      </header>

      {/* Search Bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find a friend..."
            className="w-full bg-[#0F121D] border border-white/5 rounded-xl h-10 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10"
          />
        </div>
      </div>

      {/* Friend List Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-2 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          </div>
        ) : filteredFriends.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            {activeTab === FriendTab.PENDING ? "No pending requests" : activeTab === FriendTab.BLOCKED ? "No blocked users" : "No friends found"}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFriends.map((friend) => (
              <div key={friend.id} className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={friend.friend.avatar}
                    fallback={friend.friend.username}
                    status={friend.friend.status as "online" | "offline" | "idle" | "dnd"}
                    size="md"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-white">{friend.friend.username}</p>
                    <p className="text-xs text-white/40 truncate">
                      {friend.status === "pending"
                        ? isReceivedPendingRequest(friend)
                          ? "Incoming friend request"
                          : "Friend request sent"
                        : getStatusText(friend.friend.status)}
                    </p>
                  </div>
                </div>

                {/* Actions based on status */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {friend.status === "pending" && isReceivedPendingRequest(friend) ? (
                    // Show Accept/Reject buttons for recieved requests
                    <>
                      <button
                        onClick={() => handleAcceptRequest(friend.userId, friend.id)}
                        disabled={processing === friend.id}
                        className="p-2.5 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                        title="Accept"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleRejectRequest(friend.userId, friend.id)}
                        disabled={processing === friend.id}
                        className="p-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : friend.status === "pending" ? null : (
                    // Show message/phone/remove for accepted friends
                    <>
                      <button className="p-2.5 rounded-full bg-[#090B11] text-white/50 hover:text-indigo-400 transition-colors">
                        <MessageSquare size={18} />
                      </button>
                      <button className="p-2.5 rounded-full bg-[#090B11] text-white/50 hover:text-indigo-400 transition-colors">
                        <Phone size={18} />
                      </button>
                      {activeTab !== FriendTab.BLOCKED && (
                        <button
                          onClick={() => handleRemoveFriend(friend.friendId)}
                          className="p-2.5 rounded-full bg-[#090B11] text-white/50 hover:text-red-400 transition-colors"
                          title="Remove Friend"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Friend Modal */}
      <AddFriendModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchFriends}
      />
    </div>
  );
}