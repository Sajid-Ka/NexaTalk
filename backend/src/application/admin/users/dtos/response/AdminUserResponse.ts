import { GlobalRole } from "../../../../../shared/constants/userRole.const";
import { UserAccountStatus } from "../../../../../shared/constants/authStatus.const";
import { UserPresenceStatus } from "../../../../../shared/constants/userPresenceStatus.const";

export interface AdminUserResponse {
  id: string;
  username: string;
  email: string;
  role: GlobalRole;
  status: UserAccountStatus;
  presenceStatus: UserPresenceStatus;
  createdAt: Date;
}
