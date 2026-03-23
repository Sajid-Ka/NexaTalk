import { injectable } from "inversify";
import { Server } from "../../../../domain/features/servers/entities/Server";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { ServerModel, IServerPersistence } from "../database/ServerModel";
import { ServerPersistenceMapper } from "../mappers/ServerMapper";
import { ServerPrivacy } from "../../../../shared/constants/server.const";

@injectable()
export class ServerRepository
  extends BaseRepository<IServerPersistence, Server>
  implements IServerRepository
{
  constructor() {
    super(ServerModel, new ServerPersistenceMapper());
  }

  async findByOwner(ownerId: string): Promise<Server[]> {
    const docs = await this.model
      .find({ ownerId, deletedAt: null })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findPublicServers(limit: number = 20, offset: number = 0): Promise<Server[]> {
    const docs = await this.model
      .find({ 
        privacy: ServerPrivacy.PUBLIC, 
        deletedAt: null,
        isDisabled: false 
      })
      .sort({ memberCount: -1, createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async search(query: string, limit: number = 10): Promise<Server[]> {
    if (!query || query.trim().length < 2) return [];

    const docs = await this.model
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { $text: { $search: query } },
        ],
        deletedAt: null,
        isDisabled: false,
      })
      .limit(limit)
      .lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async incrementMemberCount(serverId: string): Promise<void> {
    await this.model.updateOne(
      { _id: serverId },
      { $inc: { memberCount: 1 } }
    );
  }

  async decrementMemberCount(serverId: string): Promise<void> {
    await this.model.updateOne(
      { _id: serverId },
      { $inc: { memberCount: -1 } }
    );
  }

  async findByUser(userId: string): Promise<Server[]> {
    const members = await this.model.aggregate([
      {
        $lookup: {
          from: "servermembers",
          localField: "_id",
          foreignField: "serverId",
          as: "members",
        },
      },
      {
        $match: {
          "members.userId": userId,
          deletedAt: null,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return members.map((doc) => this.mapper.toDomain(doc));
  }

  async findByIdWithMembers(serverId: string): Promise<Server | null> {
    const doc = await this.model
      .findOne({ _id: serverId, deletedAt: null })
      .lean();
    return doc ? this.mapper.toDomain(doc) : null;
  }
}