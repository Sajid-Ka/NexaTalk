import { api } from "../../../shared/api/axios";
import type { FriendshipStatus } from "../../../shared/constants/friend.const";
import { UserPresence } from "../../../shared/constants/user.const";

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend: {
    id: string;
    username: string;
    avatar?: string;
    status: UserPresence;
    lastSeenAt?: string;
  };
  status: FriendshipStatus;
  createdAt: string;
}

export interface FriendListResponse {
  friends: Friend[];
  total: number;
  online: number;
  offline: number;
}

export interface SendFriendRequestRequest {
  friendId: string;
}

export interface RespondFriendRequestRequest {
  status: Extract<FriendshipStatus, "accepted" | "blocked">;
}

export const getFriendsApi = (params?: { status?: string; search?: string }) =>
  api.get<{ data: FriendListResponse }>("/friends", { params });

export const getPendingRequestsApi = (type?: "received" | "sent") =>
  api.get<{ data: Friend[] }>("/friends/requests", { params: { type } });

export const sendFriendRequestApi = (data: SendFriendRequestRequest) =>
  api.post<{ data: Friend }>("/friends", data);

export const respondFriendRequestApi = (userId: string, data: RespondFriendRequestRequest) =>
  api.patch<{ data: Friend }>(`/friends/requests/${userId}`, data);

export const removeFriendApi = (userId: string) =>
  api.delete(`/friends/${userId}`);