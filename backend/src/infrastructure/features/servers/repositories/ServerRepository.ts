import { injectable } from "inversify";
import { Types } from "mongoose";
import { Server } from "../../../../domain/features/servers/entities/Server";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { toMongoSession } from "../../../core/common/database/toMongoSession";
import { ServerModel, IServerPersistence } from "../models/ServerModel";
import { ServerPersistenceMapper } from "../mappers/ServerMapper";
import { ServerPrivacy } from "../../../../shared/constants/server.const";
import { ServerMemberModel } from "../models/ServerMemberModel";

@injectable()
export class ServerRepository
  extends BaseRepository<IServerPersistence, Server>
  implements IServerRepository
{
  constructor() {
    super(ServerModel, new ServerPersistenceMapper());
  }

  async findByOwner(ownerId: string): Promise<Server[]> {
    const docs = await this.model.find({ ownerId, deletedAt: null }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findPublicServers(limit: number = 20, offset: number = 0): Promise<Server[]> {
    const docs = await this.model.aggregate([
      { $match: { privacy: ServerPrivacy.PUBLIC, deletedAt: null, isDisabled: false } },
      { $sort: { memberCount: -1, createdAt: -1 } },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: "serverchannels", // Matches ChannelModel collection
          let: { serverIdObj: "$_id" },
          pipeline: [{ $match: { $expr: { $eq: ["$serverId", { $toString: "$$serverIdObj" }] } } }],
          as: "channels",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { ownerIdStr: "$ownerId" },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$ownerIdStr"] } } },
            { $project: { username: 1 } },
          ],
          as: "owner",
        },
      },
      {
        $addFields: {
          channelCount: { $size: "$channels" },
          ownerName: { $arrayElemAt: ["$owner.username", 0] },
        },
      },
      { $project: { channels: 0, owner: 0 } },
    ]);
    return docs.map((doc) =>
      this.mapper.toDomain({ ...doc, _id: doc._id, id: doc._id.toString() }),
    );
  }

  async search(query: string, limit: number = 10): Promise<Server[]> {
    if (!query || query.trim().length < 2) return [];

    const docs = await this.model
      .find({
        $or: [{ name: { $regex: query, $options: "i" } }, { $text: { $search: query } }],
        deletedAt: null,
        isDisabled: false,
      })
      .limit(limit)
      .lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async incrementMemberCount(serverId: string, transaction?: TransactionContext): Promise<void> {
    await this.model
      .updateOne({ _id: new Types.ObjectId(serverId) }, { $inc: { memberCount: 1 } })
      .session(toMongoSession(transaction) ?? null);
  }

  async decrementMemberCount(serverId: string, transaction?: TransactionContext): Promise<void> {
    await this.model
      .updateOne({ _id: new Types.ObjectId(serverId) }, { $inc: { memberCount: -1 } })
      .session(toMongoSession(transaction) ?? null);
  }

  async findById(id: string): Promise<Server | null> {
    const doc = await this.findByIdRaw(id);

    if (!doc || doc.deletedAt || doc.isDisabled) {
      return null;
    }

    return this.mapper.toDomain(doc);
  }

  async findByUser(userId: string): Promise<Server[]> {
    const membership = await ServerMemberModel.find({ userId }).lean();
    const serverIds = membership.map((m) => m.serverId);

    if (serverIds.length === 0) return [];

    const docs = await this.model
      .find({
        _id: { $in: serverIds.map((id) => new Types.ObjectId(id)) },
        deletedAt: null,
        isDisabled: false,
      })
      .sort({ createdAt: -1 })
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findByIdWithMembers(serverId: string): Promise<Server | null> {
    const doc = await this.model
      .findOne({
        _id: new Types.ObjectId(serverId),
        deletedAt: null,
        isDisabled: false,
      })
      .lean();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async updateOwner(
    serverId: string,
    ownerId: string,
    transaction?: TransactionContext,
  ): Promise<void> {
    await this.model
      .updateOne({ _id: new Types.ObjectId(serverId) }, { $set: { ownerId } })
      .session(toMongoSession(transaction) ?? null);
  }
}
