import { SortOrder, SortField } from "../../../../shared/constants/sort.const";
import { UserAccountStatus } from "../../../../shared/constants/authStatus.const";
import { GlobalRole } from "../../../../shared/constants/user.const";

export interface AdminUserQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserAccountStatus;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  role?: GlobalRole;
  dateFrom?: Date;
  dateTo?: Date;
}
