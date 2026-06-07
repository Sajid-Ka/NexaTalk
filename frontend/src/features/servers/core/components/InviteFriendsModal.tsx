import { useState, useEffect } from "react";
import { UserPlus, Search } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../../../../shared/ui/Modal";
import { getFriendsApi } from "../../../friends/api/friendApi";
import type { Friend } from "../../../friends/api/friendApi";
import { getServerMembersApi } from "../../settings/api/serverSettingsApi";
import {
  sendDirectServerInviteApi,
  getSentServerInvitesApi,
  type SentServerDirectInvite,
} from "../../../notifications/api/notificationApi";
import type { ServerMember } from "../types";
import { AxiosError } from "axios";
import Avatar from "../../../../shared/ui/Avatar";

interface ApiErrorResponse {
  error?: { code?: string; message?: string };
  message?: string;
}

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
}

type InviteStatus = "idle" | "sending" | "pending" | "joined";

export default function InviteFriendsModal({ isOpen, onClose, serverId }: InviteFriendsModalProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteStatuses, setInviteStatuses] = useState<Record<string, InviteStatus>>({});

  useEffect(() => {
    const fetchFriendsAndMembers = async () => {
      try {
        setLoading(true);

        const [friendsRes, membersRes, sentInvitesRes] = await Promise.all([
          getFriendsApi({ status: "accepted" }),
          getServerMembersApi(serverId),
          getSentServerInvitesApi(serverId),
        ]);

        const loadedFriends: Friend[] = friendsRes.data.data.friends || [];
        const loadedMembers: ServerMember[] = membersRes.data.data || [];
        const sentInvites: SentServerDirectInvite[] = sentInvitesRes.data?.data || [];

        setFriends(loadedFriends);

        const initialStatuses: Record<string, InviteStatus> = {};
        const memberIds = new Set(loadedMembers.map((m) => m.userId));
        const pendingUserIds = new Set(sentInvites.map((inv) => inv.receiverId));

        loadedFriends.forEach((f) => {
          if (memberIds.has(f.friend.id)) {
            initialStatuses[f.friend.id] = "joined";
          } else if (pendingUserIds.has(f.friend.id)) {
            initialStatuses[f.friend.id] = "pending";
          }
        });

        setInviteStatuses(initialStatuses);
      } catch {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchFriendsAndMembers();
    }
  }, [isOpen, serverId]);

  const handleSendInvite = async (friendId: string) => {
    try {
      setInviteStatuses((prev) => ({ ...prev, [friendId]: "sending" }));
      await sendDirectServerInviteApi(serverId, friendId);
      setInviteStatuses((prev) => ({ ...prev, [friendId]: "pending" }));
      toast.success("Invite sent successfully!");
    } catch (err) {
      let errorMessage = "Failed to send invite";
      let errorCode: string | undefined;

      if (err instanceof AxiosError) {
        const data = err.response?.data as ApiErrorResponse;
        errorMessage = data?.error?.message || data?.message || errorMessage;
        errorCode = data?.error?.code;
      }

      if (
        errorCode === "DIRECT_INVITE_ALREADY_PENDING" ||
        errorMessage === "An invite to this server is already pending for this user."
      ) {
        setInviteStatuses((prev) => ({ ...prev, [friendId]: "pending" }));
      } else if (
        errorCode === "ALREADY_MEMBER" ||
        errorMessage === "This user is already a member of the server."
      ) {
        setInviteStatuses((prev) => ({ ...prev, [friendId]: "joined" }));
      } else {
        setInviteStatuses((prev) => ({ ...prev, [friendId]: "idle" }));
      }

      toast.error(errorMessage);
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-[500px] bg-[#0B1020] w-[400px]">
        <div className="p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <UserPlus className="text-violet-400" size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Invite Friends</h2>
          </div>
          <p className="text-sm text-white/50 mb-4">Invite your friends to join this server.</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1F30] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-violet-500 animate-spin" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="text-center py-8 text-white/50 text-sm">No friends found.</div>
          ) : (
            <div className="space-y-2">
              {filteredFriends.map((friend) => {
                const status = inviteStatuses[friend.friend.id] || "idle";
                const isBtnDisabled =
                  status === "sending" || status === "pending" || status === "joined";

                return (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={friend.friend.avatar}
                        alt={friend.friend.username}
                        fallback={friend.friend.username}
                        status={friend.friend.status as "online" | "offline" | "idle" | "dnd" | "streaming"}
                        size="md"
                      />
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {friend.friend.username}
                        </div>
                        <div className="text-xs text-white/50 capitalize">{friend.friend.status}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleSendInvite(friend.friend.id)}
                      disabled={isBtnDisabled}
                      className="px-4 py-1.5 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "sending"
                        ? "Sending..."
                        : status === "pending"
                          ? "Pending"
                          : status === "joined"
                            ? "Joined"
                            : "Invite"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}