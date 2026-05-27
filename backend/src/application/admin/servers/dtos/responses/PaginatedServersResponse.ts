import { AdminServerResponse } from "./AdminServerResponse";

export interface PaginatedServersResponse {
  servers: AdminServerResponse[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}