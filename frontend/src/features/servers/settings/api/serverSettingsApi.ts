import { api } from "../../../../shared/api/axios";
import type { ServerImageType } from "../../../../shared/constants/server.const";
import type { CreateServerRequest } from "../../core/types";
import type { Server } from "../../core/types";

export const updateServerApi = (serverId: string, data: Partial<CreateServerRequest>) =>
  api.patch<{ data: Server }>(`/servers/${serverId}`, data);

export const uploadServerImageApi = async (
  serverId: string,
  file: File,
  type: ServerImageType,
): Promise<Server> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);

  const response = await api.post<{ data: Server }>(
    `/servers/${serverId}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
};

export const getServerMembersApi = (serverId: string) =>
  api.get(`/servers/${serverId}/members`);

export const updateMemberRoleApi = (serverId: string, memberId: string, role: string) =>
  api.patch(`/servers/${serverId}/members/${memberId}/role`, { role });

export const transferOwnershipApi = (serverId: string, memberId: string) =>
  api.post(`/servers/${serverId}/members/${memberId}/transfer-ownership`);

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
