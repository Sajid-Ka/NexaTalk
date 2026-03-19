import { User } from "../../auth/entities/User";
import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { AdminUserQuery } from "../types/AdminUserQuery";

export interface IAdminUserRepository extends IBaseRepository<User> {
  findUsers(
    query: AdminUserQuery,
  ): Promise<{ users: User[]; total: number; page?: number; limit: number }>;
}
