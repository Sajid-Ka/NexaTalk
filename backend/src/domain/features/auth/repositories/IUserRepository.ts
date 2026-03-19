import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { User } from "../entities/User";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}
