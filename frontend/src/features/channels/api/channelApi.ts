import { api } from "../../../shared/api/axios";
import type { CreateChannelRequest } from "../types";

export const getChannelsApi = (serverId: string) =>
  api.get(`/servers/${serverId}/channels`);

export const createChannelApi = (serverId: string, data: CreateChannelRequest) =>
  api.post(`/servers/${serverId}/channels`, data);

export const updateChannelApi = (serverId: string, channelId: string, data: { name: string }) =>
  api.patch(`/servers/${serverId}/channels/${channelId}`, data);

export const deleteChannelApi = (serverId: string, channelId: string) => 
  api.delete(`/servers/${serverId}/channels/${channelId}`);

