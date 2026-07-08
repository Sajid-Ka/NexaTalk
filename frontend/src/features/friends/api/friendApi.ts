import { api } from "../../../shared/api/axios";
import type { 
  Friend, 
  FriendListResponse, 
  SendFriendRequestRequest, 
  RespondFriendRequestRequest, 
  BlockedUserResponse 
} from "../types/friend.types";


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

export const blockUserApi = (userId: string) =>
  api.post(`/friends/block/${userId}`);

export const unblockUserApi = (userId: string) =>
  api.delete(`/friends/block/${userId}`);

export const getBlockedUsersApi = () =>
  api.get<{ data: BlockedUserResponse[] }>("/friends/blocked");