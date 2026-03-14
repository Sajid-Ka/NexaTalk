import { SortOrder, SortField } from "../../../shared/constants/sort.const";
import { UserAccountStatus } from "../../../shared/constants/userAccountStatus.const";
import { GlobalRole } from "../../../shared/constants/userRole.const";

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
