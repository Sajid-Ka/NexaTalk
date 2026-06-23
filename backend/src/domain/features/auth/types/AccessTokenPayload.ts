import { GlobalRole } from "../../../../shared/constants/user.const";

export interface AccessTokenPayload {
  userId: string;
  role: GlobalRole;
  sessionVersion: number;
}
