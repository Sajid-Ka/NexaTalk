import { AuthUserResponse } from "./shared/AuthUserResponse";

export interface LoginUserResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponse;
  requiresOnboarding: boolean;
}
