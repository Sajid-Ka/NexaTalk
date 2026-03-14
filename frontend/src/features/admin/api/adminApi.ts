import { api } from "../../../shared/api/axios";
import { AppRoute } from "../../../shared/constants/app-route.const";
import { UserStatus } from "../../../shared/constants/user.const";

export const getUsersApi = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: UserStatus;
}) => api.get(`${AppRoute.ADMIN_USERS}`, {params});

export const getUserDetailsApi = (id : string) => 
    api.get(`${AppRoute.ADMIN_USERS}/${id}`);

export const blockUserApi = (id : string) =>
    api.patch(`${AppRoute.ADMIN_USERS}/${id}/block`);

export const unblockUserApi = (id : string) => 
    api.patch(`${AppRoute.ADMIN_USERS}/${id}/unblock`);

export const deleteUserApi = (id : string) => 
    api.delete(`${AppRoute.ADMIN_USERS}/${id}`)