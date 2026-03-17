import { GlobalRole } from "../../../../../shared/constants/userRole.const";

export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  globalRole: GlobalRole;
}
