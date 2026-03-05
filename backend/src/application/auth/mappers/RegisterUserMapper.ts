import { User } from "../../../domain/auth/entities/User";

export class RegisterUserMapper {
  static toRegisterResponse(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
