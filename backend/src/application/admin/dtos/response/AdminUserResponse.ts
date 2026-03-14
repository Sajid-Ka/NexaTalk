import { GlobalRole } from "../../../../shared/constants/userRole.const";
import { UserAccountStatus } from "../../../../shared/constants/userAccountStatus.const";

export interface AdminUserResponse {
  id: string;
  username: string;
  email: string;
  role: GlobalRole;
  status: UserAccountStatus;
  createdAt: Date;
}
