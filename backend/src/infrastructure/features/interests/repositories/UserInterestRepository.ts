import { injectable } from "inversify";
import { UserInterest } from "../../../../domain/features/interests/entities/UserInterest";
import { Interest } from "../../../../domain/features/interests/entities/Interest";
import { IUserInterestRepository } from "../../../../domain/features/interests/repositories/IUserInterestRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { UserInterestModel, IUserInterestPersistence } from "../database/UserInterestModel";
import { InterestModel } from "../database/InterestModel";
import { UserInterestMapper } from "../mappers/UserInterestMapper";
import { InterestMapper } from "../mappers/InterestMapper";
import { MaxInterestsReachedError } from "../../../../domain/features/interests/errors/MaxInterestsReachedError";

@injectable()
export class UserInterestRepository
  extends BaseRepository<IUserInterestPersistence, UserInterest>
  implements IUserInterestRepository
{
  private readonly _interestMapper = new InterestMapper();
  private readonly MAX_INTERESTS_PER_USER = 20;

  constructor() {
    super(UserInterestModel, new UserInterestMapper());
  }

  async findByUser(userId: string): Promise<Interest[]> {
    const userInterests = await this.model.find({ userId }).lean();

    if (userInterests.length === 0) return [];

    const interestIds = userInterests.map((ui) => ui.interestId);

    const interests = await InterestModel.find({ _id: { $in: interestIds } }).lean();

    return interests.map((doc) => this._interestMapper.toDomain(doc));
  }

  async addInterests(userId: string, interestIds: string[]): Promise<void> {
    // Check current count
    const currentCount = await this.model.countDocuments({ userId });

    if (currentCount + interestIds.length > this.MAX_INTERESTS_PER_USER) {
      throw new MaxInterestsReachedError(this.MAX_INTERESTS_PER_USER);
    }

    const operations = interestIds.map((interestId) => ({
      updateOne: {
        filter: { userId, interestId },
        update: { $setOnInsert: { userId, interestId } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.model.bulkWrite(operations);
    }
  }

  async removeInterests(userId: string, interestIds: string[]): Promise<void> {
    await this.model.deleteMany({
      userId,
      interestId: { $in: interestIds },
    });
  }

  async hasInterest(userId: string, interestId: string): Promise<boolean> {
    const count = await this.model.countDocuments({ userId, interestId });
    return count > 0;
  }

  async findUsersWithSharedInterests(
    userId: string,
    interestIds: string[],
    limit: number = 20,
    excludeSelf: boolean = true,
  ): Promise<Array<{ userId: string; sharedInterests: string[]; matchCount: number }>> {
    if (!interestIds.length) return [];

    const matchStage: Record<string, unknown> = {
      interestId: { $in: interestIds },
    };

    if (excludeSelf) {
      matchStage.userId = { $ne: userId };
    }

    const results = await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$userId",
          sharedInterests: { $addToSet: "$interestId" },
          matchCount: { $sum: 1 },
        },
      },
      { $sort: { matchCount: -1 } },
      { $limit: limit },
      {
        $project: {
          userId: "$_id",
          sharedInterests: 1,
          matchCount: 1,
          _id: 0,
        },
      },
    ]);

    return results;
  }

  async getUsersByInterest(interestId: string, limit: number = 50): Promise<string[]> {
    const userInterests = await this.model.find({ interestId }).limit(limit).lean();

    return userInterests.map((ui) => ui.userId);
  }

  async getInterestIdsByUser(userId: string): Promise<string[]> {
    const userInterests = await this.model.find({ userId }).lean();

    return userInterests.map((ui) => ui.interestId);
  }

  async findAllUsersWithInterests(): Promise<Array<{ userId: string; interestIds: string[] }>> {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: "$userId",
          interestIds: { $addToSet: "$interestId" },
        },
      },
      {
        $project: {
          userId: "$_id",
          interestIds: 1,
          _id: 0,
        },
      },
    ]);

    return result;
  }
}
