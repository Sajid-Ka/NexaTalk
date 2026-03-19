import { injectable } from "inversify";
import { ServerInterest } from "../../../domain/interests/entities/ServerInterest";
import { Interest } from "../../../domain/interests/entities/Interest";
import { IServerInterestRepository } from "../../../domain/interests/repositories/IServerInterestRepository";
import { BaseRepository } from "../../common/database/BaseRepository";
import { ServerInterestModel, IServerInterestPersistence } from "../database/ServerInterestModel";
import { InterestModel } from "../database/InterestModel";
import { ServerInterestMapper } from "../mappers/ServerInterestMapper";
import { InterestMapper } from "../mappers/InterestMapper";

@injectable()
export class ServerInterestRepository
  extends BaseRepository<IServerInterestPersistence, ServerInterest>
  implements IServerInterestRepository
{
  private readonly _interestMapper = new InterestMapper();

  constructor() {
    super(ServerInterestModel, new ServerInterestMapper());
  }

  async findByServer(serverId: string): Promise<Interest[]> {
    const serverInterests = await this.model.find({ serverId }).lean();

    if (serverInterests.length === 0) return [];

    const interestIds = serverInterests.map((si) => si.interestId);

    const interests = await InterestModel.find({ _id: { $in: interestIds } }).lean();

    return interests.map((doc) => this._interestMapper.toDomain(doc));
  }

  async addInterests(serverId: string, interestIds: string[]): Promise<void> {
    const operations = interestIds.map((interestId) => ({
      updateOne: {
        filter: { serverId, interestId },
        update: { $setOnInsert: { serverId, interestId } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await this.model.bulkWrite(operations);
    }
  }

  async removeInterests(serverId: string, interestIds: string[]): Promise<void> {
    await this.model.deleteMany({
      serverId,
      interestId: { $in: interestIds },
    });
  }

  async findServersByInterests(
    interestIds: string[],
    limit: number = 20,
    excludeServerIds: string[] = [],
  ): Promise<Array<{ serverId: string; matchedInterests: string[]; matchCount: number }>> {
    if (!interestIds.length) return [];

    const matchStage: Record<string, unknown> = {
      interestId: { $in: interestIds },
    };

    if (excludeServerIds.length > 0) {
      matchStage.serverId = { $nin: excludeServerIds };
    }

    const results = await this.model.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$serverId",
          matchedInterests: { $addToSet: "$interestId" },
          matchCount: { $sum: 1 },
        },
      },
      { $sort: { matchCount: -1 } },
      { $limit: limit },
      {
        $project: {
          serverId: "$_id",
          matchedInterests: 1,
          matchCount: 1,
          _id: 0,
        },
      },
    ]);

    return results;
  }

  async getInterestIdsByServer(serverId: string): Promise<string[]> {
    const serverInterests = await this.model.find({ serverId }).lean();

    return serverInterests.map((si) => si.interestId);
  }
}
