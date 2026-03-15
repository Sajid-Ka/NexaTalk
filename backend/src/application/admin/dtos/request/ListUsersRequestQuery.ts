import { UserAccountStatus } from "../../../../shared/constants/authStatus.const";

export interface ListUsersRequestQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserAccountStatus;
  sort?: string;
}
