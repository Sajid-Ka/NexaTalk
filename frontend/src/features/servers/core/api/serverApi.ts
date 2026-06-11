import { api } from "../../../../shared/api/axios";
import type { CreateServerRequest } from "../types";

export const createServerApi = (data: CreateServerRequest) =>
  api.post("/servers", data);

export const getUserServersApi = () =>
  api.get("/servers/user");

export const getPublicServersApi = (tag?: string, search?: string) => {
  const params = new URLSearchParams();
  if (tag && tag !== 'all') params.append('tag', tag);
  if (search) params.append('search', search);
  return api.get(`/servers/public?${params.toString()}`);
};

export const getServerApi = (serverId: string) =>
  api.get(`/servers/${serverId}`);

export const joinServerApi = (serverId: string) =>
  api.post(`/servers/${serverId}/join`);

export const leaveServerApi = (serverId: string) =>
  api.post(`/servers/${serverId}/leave`);

export const joinByInviteApi = (code: string) =>
  api.post(`/servers/invite/${code}`);
