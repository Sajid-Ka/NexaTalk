import { api } from "../../../../shared/api/axios";
import type { CreateServerRequest } from "../../core/types";

export const updateServerApi = (serverId: string, data: Partial<CreateServerRequest>) =>
  api.patch(`/servers/${serverId}`, data);

export const deleteServerApi = (serverId: string) =>
  api.delete(`/servers/${serverId}`);

export const createInviteApi = (serverId: string, data: { maxUses?: number; expiresAt?: Date | null }) =>
  api.post(`/servers/${serverId}/invites`, data);

export const getServerMembersApi = (serverId: string) =>
  api.get(`/servers/${serverId}/members`);

export const updateMemberRoleApi = (serverId: string, memberId: string, role: string) =>
  api.patch(`/servers/${serverId}/members/${memberId}/role`, { role });

export const kickMemberApi = (serverId: string, memberId: string) =>
  api.delete(`/servers/${serverId}/members/${memberId}`);