import { GlobalRole } from "../../../shared/enums/userRole.enum";

export interface AccessTokenPayload {
  userId: string;
  role: GlobalRole;
}
