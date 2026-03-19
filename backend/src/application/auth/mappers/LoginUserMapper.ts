import { User } from "../../../domain/features/auth/entities/User";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";

export class LoginUserMapper {
  static toLoginResponse(user: User, accessToken: string, refreshToken: string): LoginUserResponse {
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        globalRole: user.globalRole,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
      requiresOnboarding: !user.hasCompletedOnboarding,
    };
  }
}
