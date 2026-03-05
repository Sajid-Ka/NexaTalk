import { User } from "../../../domain/auth/entities/User";

export class LoginUserMapper {

  static toLoginResponse(user: User, accessToken: string, refreshToken: string) {
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        globalRole: user.globalRole,
      },
    };
  }
}
