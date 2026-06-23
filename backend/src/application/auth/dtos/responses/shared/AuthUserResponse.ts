import { GlobalRole } from "../../../../../shared/constants/user.const";

export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  globalRole: GlobalRole;
  hasCompletedOnboarding: boolean;
  authProviders?: {
    password: boolean;
    google: boolean;
  };
}
