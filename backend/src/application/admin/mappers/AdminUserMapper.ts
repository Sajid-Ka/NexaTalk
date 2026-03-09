import { User } from "../../../domain/auth/entities/User";
import { AdminUserResponse } from "../dtos/response/AdminUserResponse";

export class AdminUserMapper {
    static toResponse(user : User) : AdminUserResponse {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.globalRole,
            status: user.status,
            isBlocked: user.isBlocked,
            createdAt: user.createdAt,
        }
    }

    static toList(users : User[]) : AdminUserResponse[] {
        return users.map((u) => this.toResponse(u));
    }
}