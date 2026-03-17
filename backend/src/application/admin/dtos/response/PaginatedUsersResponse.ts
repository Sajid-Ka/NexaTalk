import { AdminUserResponse } from "./AdminUserResponse";

export interface PaginatedUsersResponse {
  users: AdminUserResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
