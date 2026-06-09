import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { User } from "../entities/User";

export interface IUserRepository extends IBaseRepository<User> {
  findByGoogleId(googleId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailIncludingDeleted(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByUsernameIncludingDeleted(username: string): Promise<User | null>;
  search(query: string, limit: number): Promise<User[]>;
  searchPublicProfiles(query: string, limit: number): Promise<User[]>;
}
