import { UserAccountStatus } from "../../../../shared/constants/userAccountStatus.const";

export interface ListUsersRequestQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserAccountStatus;
  sort?: string;
}
