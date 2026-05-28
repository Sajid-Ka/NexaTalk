import { api } from "../../../../shared/api/axios";
import type { AdminServerSort, AdminServerSortOrder, AdminServerStatus } from "../../../../shared/constants/serverManagement.const";

export const getAdminServersApi = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminServerStatus;
  sort?: AdminServerSort;
  sortOrder?: AdminServerSortOrder
}) => api.get("/admin/servers", { params });

export const disableAdminServerApi = (id: string) =>
  api.patch(`/admin/servers/${id}/disable`);

export const enableAdminServerApi = (id: string) =>
  api.patch(`/admin/servers/${id}/enable`);

export const deleteAdminServerApi = (id: string) =>
  api.delete(`/admin/servers/${id}`);