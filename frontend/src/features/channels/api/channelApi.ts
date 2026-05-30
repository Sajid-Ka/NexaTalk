import { api } from "../../../shared/api/axios";
import type { CreateChannelRequest } from "../types";

export const getChannelsApi = (serverId: string) =>
  api.get(`/servers/${serverId}/channels`);

export const createChannelApi = (serverId: string, data: CreateChannelRequest) =>
  api.post(`/servers/${serverId}/channels`, data);
