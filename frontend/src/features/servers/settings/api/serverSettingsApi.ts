import { api } from "../../../../shared/api/axios";
import type { CreateServerRequest } from "../../core/types";

export const updateServerApi = (serverId: string, data: Partial<CreateServerRequest>) =>
  api.patch(`/servers/${serverId}`, data);

export const getServerMembersApi = (serverId: string) =>
  api.get(`/servers/${serverId}/members`);

export const updateMemberRoleApi = (serverId: string, memberId: string, role: string) =>
  api.patch(`/servers/${serverId}/members/${memberId}/role`, { role });

export const kickMemberApi = (serverId: string, memberId: string) =>
  api.delete(`/servers/${serverId}/members/${memberId}`);

export const createInviteApi = (serverId: string, data: { maxUses?: number; expiresInDays?: number }) =>
  api.post(`/servers/${serverId}/invites`, data);

export const getServerInvitesApi = (serverId: string) =>
  api.get(`/servers/${serverId}/invites`);

export const revokeInviteApi = (serverId: string, inviteId: string) =>
  api.delete(`/servers/${serverId}/invites/${inviteId}`);

export const deleteServerApi = (serverId: string) =>
  api.delete(`/servers/${serverId}`);

export const getServerBansApi = (serverId: string) =>
  api.get(`/servers/${serverId}/bans`);

export const banServerMemberApi = (serverId: string, data: { userId: string; reason?: string }) => api.post(`/servers/${serverId}/bans`, data);

export const unbanServerMemberApi = (serverId: string, userId: string) =>
  api.delete(`/servers/${serverId}/bans/${userId}`);

export const searchServerBanCandidatesApi = (serverId: string, query: string) => api.get(`/servers/${serverId}/ban-candidates`, {
  params: { q: query },
});

export const getServerAuditLogsApi = (
  serverId: string,
  params?: { limit?: number; offset?: number },
) => api.get(`/servers/${serverId}/audit-logs`, { params });
