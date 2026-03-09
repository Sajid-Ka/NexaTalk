import { GlobalRole } from "../../../../shared/types/user.types";

export interface LoginUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    globalRole: GlobalRole;
  };
}
