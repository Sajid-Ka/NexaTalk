import { User } from "../../../domain/features/auth/entities/User";
import { AdminUserResponse } from "../dtos/response/AdminUserResponse";

export class AdminUserMapper {
  static toResponse(user: User): AdminUserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.globalRole,
      status: user.accountStatus,
      createdAt: user.createdAt,
    };
  }

  static toList(users: User[]): AdminUserResponse[] {
    return users.map((u) => this.toResponse(u));
  }
}
