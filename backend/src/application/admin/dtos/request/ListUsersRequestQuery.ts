export type UserStatusFilter = "active" | "blocked";

export interface ListUsersRequestQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: UserStatusFilter;
    sort?: string;
}