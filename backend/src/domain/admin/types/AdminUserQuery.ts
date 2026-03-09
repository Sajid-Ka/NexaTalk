export type AdminUserStatus = "active" | "blocked";

export interface AdminUserQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: AdminUserStatus;
    sort?: string;
}