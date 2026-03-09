import { GlobalRole } from "../../../shared/types/user.types";

export interface AccessTokenPayload {
  userId: string;
  role: GlobalRole;
}
