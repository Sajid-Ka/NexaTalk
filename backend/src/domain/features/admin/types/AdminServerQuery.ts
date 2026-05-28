export interface AdminServerQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "disabled";
  sort?: string;
}
