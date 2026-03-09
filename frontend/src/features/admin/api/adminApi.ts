import { api } from "../../../shared/api/axios";

export const getUsersApi = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "blocked";
}) => api.get("/admin/users", {params});

export const getUserDetailsApi = (id : string) => 
    api.get(`/admin/users/${id}`);

export const blockUserApi = (id : string) =>
    api.patch(`/admin/users/${id}/block`);

export const unblockUserApi = (id : string) => 
    api.patch(`/admin/users/${id}/unblock`);

export const deleteUserApi = (id : string) => 
    api.delete(`/admin/users/${id}`)