import { GlobalRole } from "../../../../domain/auth/entities/User";

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
