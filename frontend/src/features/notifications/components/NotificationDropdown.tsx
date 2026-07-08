import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import { getPendingRequestsApi, respondFriendRequestApi } from "../../friends/api/friendApi";
import type { Friend } from "../../friends/types/friend.types";
import { getPendingServerInvitesApi, respondToDirectInviteApi } from "../api/notificationApi";
import type { ServerDirectInvite } from "../api/notificationApi";
import { FriendshipStatus } from "../../../shared/constants/friend.const";
import { DirectInviteStatus } from "../../../shared/constants/server.const";
import Avatar from "../../../shared/ui/Avatar";
import { AvatarSize } from "../../../shared/constants/avatar.const";
import EmptyState from "../../../shared/ui/EmptyState";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [serverInvites, setServerInvites] = useState<ServerDirectInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const [friendReqsRes, invitesRes] = await Promise.all([
        getPendingRequestsApi("received"),
        getPendingServerInvitesApi()
      ]);

      setFriendRequests(friendReqsRes.data.data || []);
      setServerInvites(invitesRes.data.data || []);
      
    } catch {
      console.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = async (request: Friend, action: 'accept' | 'reject') => {
    try {
      const status = action === 'accept' ? FriendshipStatus.ACCEPTED : FriendshipStatus.BLOCKED;
      await respondFriendRequestApi(request.userId, { status });
      setFriendRequests(prev => prev.filter(req => req.id !== request.id));
      toast.success(`Friend request ${action}ed`);
    } catch {
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleServerInvite = async (inviteId: string, action: "accept" | "reject") => {
    if (!inviteId) {
      toast.error("Invalid invite");
      return;
    }

    try {
      const status =
        action === "accept" ? DirectInviteStatus.ACCEPTED : DirectInviteStatus.REJECTED;

      await respondToDirectInviteApi(inviteId, status);

      setServerInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
      toast.success(`Server invite ${action}ed`);
    } catch {
      toast.error(`Failed to ${action} invite`);
    }
  };

  const totalNotifications = friendRequests.length + serverInvites.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/85 hover:bg-white/10 transition-colors"
      >
        <Bell size={16} />
        {totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {totalNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-[#0B1020] shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#111827]">
            <h3 className="font-semibold text-white">Notifications</h3>
            {totalNotifications > 0 && (
              <span className="text-xs text-white/50">{totalNotifications} new</span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-violet-500 animate-spin" />
              </div>
            ) : totalNotifications === 0 ? (
              <EmptyState
                  icon={Bell}
                  title="No notifications"
                  description="You're all caught up."
              />
            ) : (
              <div className="space-y-2">
                
                {/* Friend Requests */}
                {friendRequests.map((req) => (
                  <div key={req.id} className="flex flex-col p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Avatar 
                          src={req.friend.avatar}
                          alt={req.friend.username}
                          fallback={req.friend.username}
                          size={AvatarSize.SM}
                        />
                      <div className="text-sm text-white/90">
                        <span className="font-semibold text-white">{req.friend.username}</span> sent you a friend request.
                      </div>
                    </div>
                    <div className="flex gap-2 ml-11">
                      <button onClick={() => handleFriendRequest(req, 'accept')} className="flex-1 py-1.5 rounded bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium transition-colors">Accept</button>
                      <button onClick={() => handleFriendRequest(req, 'reject')} className="flex-1 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors">Decline</button>
                    </div>
                  </div>
                ))}

                {/* Server Invites */}
                {serverInvites.map((invite) => (
                  <div key={invite.id} className="flex flex-col p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar
                        src={invite.serverId.icon}
                        alt={invite.serverId.name}
                        fallback={invite.serverId.name}
                        size={AvatarSize.SM}
                      />
                      <div className="text-sm text-white/90">
                        <span className="font-semibold text-white">{invite.senderId.username}</span> invited you to join <span className="font-semibold text-white">{invite.serverId.name}</span>.
                      </div>
                    </div>
                    <div className="flex gap-2 ml-11">
                      <button
                        onClick={() => handleServerInvite(invite.id, "accept")}
                        className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
                      >
                        Join
                      </button>
                      <button
                        onClick={() => handleServerInvite(invite.id, "reject")}
                        className="flex-1 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
