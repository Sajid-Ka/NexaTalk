import { ServerStatus } from "../../../../shared/constants/server.const";

export interface AdminServerQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ServerStatus;
  sort?: string;
}
