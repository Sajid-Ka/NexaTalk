import { User } from "../../../domain/auth/entities/User";
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
      },
    };
  }
}
