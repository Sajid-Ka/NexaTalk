import { AuthUserResponse } from "./shared/AuthUserResponse";

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponse;
}
