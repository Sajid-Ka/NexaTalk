import { GlobalRole } from "../../../shared/constants/userRole.const";

export interface AccessTokenPayload {
  userId: string;
  role: GlobalRole;
}
