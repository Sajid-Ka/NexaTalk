import type { AccountStatus, UserPresence, UserRole } from "../../../../shared/constants/user.const";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserPresence;
  accountStatus: AccountStatus;
  joinedDate: string;
  initials: string;
}
