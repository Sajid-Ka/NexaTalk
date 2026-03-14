import { SortOrder } from "../../../shared/enums/sort.enum";
import { SortField } from "../../../shared/enums/sort.enum";
import { UserAccountStatus } from "../../../shared/enums/userAccountStatus.enum";
import { GlobalRole } from "../../../shared/enums/userRole.enum";

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
