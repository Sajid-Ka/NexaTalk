import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { UserInterest } from "../entities/UserInterest";
import { Interest } from "../entities/Interest";

export interface IUserInterestRepository extends IBaseRepository<UserInterest> {
  findByUser(userId: string): Promise<Interest[]>;
  addInterests(userId: string, interestIds: string[]): Promise<void>;
  removeInterests(userId: string, interestIds: string[]): Promise<void>;
  hasInterest(userId: string, interestId: string): Promise<boolean>;
  findUsersWithSharedInterests(
    userId: string,
    interestIds: string[],
    limit?: number,
    excludeSelf?: boolean,
  ): Promise<Array<{ userId: string; sharedInterests: string[]; matchCount: number }>>;
  getUsersByInterest(interestId: string, limit?: number): Promise<string[]>;
  getInterestIdsByUser(userId: string): Promise<string[]>;
  findAllUsersWithInterests(): Promise<Array<{ userId: string; interestIds: string[] }>>;
}
