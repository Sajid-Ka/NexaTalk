import { GlobalRole } from "../../../../../shared/enums/userRole.enum";

export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  globalRole: GlobalRole;
}
