import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { UserInterest } from "../entities/UserInterest";
import { Interest } from "../entities/Interest";

export interface IUserInterestRepository extends IBaseRepository<UserInterest> {
  findByUser(userId: string): Promise<Interest[]>; // Find all interests for a specific user
  addInterests(userId: string, interestIds: string[]): Promise<void>; // Add multiple interests to a user
  removeInterests(userId: string, interestIds: string[]): Promise<void>; // Remove multiple interests from a user
  hasInterest(userId: string, interestId: string): Promise<boolean>; // Check if a user has a specific interest
  findUsersWithSharedInterests(
    userId: string,
    interestIds: string[],
    limit?: number,
    excludeSelf?: boolean,
  ): Promise<Array<{ userId: string; sharedInterests: string[]; matchCount: number }>>; // Get users who share at least one interest with the target user
  getUsersByInterest(interestId: string, limit?: number): Promise<string[]>; // Get users who have a specific interest
  getInterestIdsByUser(userId: string): Promise<string[]>; // Get all interest IDs for a user
}
