import { ServerStatus } from "../../../../../shared/constants/server.const";

export interface ListServersRequestQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ServerStatus;
  sort?: string;
}
