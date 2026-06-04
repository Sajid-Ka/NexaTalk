import { api } from "../../../shared/api/axios";
import { DirectInviteStatus } from "../../../shared/constants/server.const";

export interface ServerDirectInvite {
  id: string;
  serverId: {
    _id: string;
    name: string;
    icon?: string;
  };
  senderId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  receiverId: string;
  status: DirectInviteStatus;
  createdAt: string;
}

export interface SentServerDirectInvite {
  id: string;
  serverId: string;
  senderId: string;
  receiverId: string;
  status: DirectInviteStatus;
  createdAt: string;
}

export const sendDirectServerInviteApi = (serverId: string, friendId: string) =>
  api.post<{ data: SentServerDirectInvite }>(`/servers/${serverId}/direct-invites`, { friendId });

export const getSentServerInvitesApi = (serverId: string) =>
  api.get<{ data: SentServerDirectInvite[] }>(`/servers/${serverId}/direct-invites/pending`);

export const getPendingServerInvitesApi = () =>
  api.get<{ data: ServerDirectInvite[] }>("/servers/me/direct-invites");

export const respondToDirectInviteApi = (inviteId: string, status: DirectInviteStatus) =>
  api.patch(`/servers/direct-invites/${inviteId}/respond`, { status });