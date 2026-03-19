import { User } from "../../../domain/features/auth/entities/User";
import { RegisterUserResponse } from "../dtos/responses/RegisterUserResponse";

export class RegisterUserMapper {
  static toRegisterResponse(user: User): RegisterUserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
