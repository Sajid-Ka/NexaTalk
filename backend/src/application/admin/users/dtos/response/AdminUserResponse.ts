import { GlobalRole } from "../../../../../shared/constants/user.const";
import { UserAccountStatus } from "../../../../../shared/constants/authStatus.const";
import { UserPresenceStatus } from "../../../../../shared/constants/user.const";

export interface AdminUserResponse {
  id: string;
  username: string;
  email: string;
  role: GlobalRole;
  status: UserAccountStatus;
  presenceStatus: UserPresenceStatus;
  createdAt: Date;
}
