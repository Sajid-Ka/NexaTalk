import { injectable } from "inversify";
import { Types } from "mongoose";
import { IAdminServerRepository } from "../../../../domain/features/admin/repositories/IAdminServerRepository";
import { AdminServerQuery } from "../../../../domain/features/admin/types/AdminServerQuery";
import { Server } from "../../../../domain/features/servers/entities/Server";
import { ServerModel, IServerPersistence } from "../../servers/models/ServerModel";
import { ServerPersistenceMapper } from "../../servers/mappers/ServerMapper";

@injectable()
export class AdminServerRepository implements IAdminServerRepository {
  private readonly _mapper = new ServerPersistenceMapper();

  async findServers(query: AdminServerQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      deletedAt: null,
    };

    if (query.status === "active") {
      filter.isDisabled = false;
    }

    if (query.status === "disabled") {
      filter.isDisabled = true;
    }

    if (query.search?.trim()) {
      const search = query.search.trim();

      filter.$or = [{ name: { $regex: search, $options: "i" } }];

      if (Types.ObjectId.isValid(search)) {
        (filter.$or as Record<string, unknown>[]).push({
          _id: new Types.ObjectId(search),
        });
      }
    }

    const sort: Record<string, 1 | -1> =
      query.sort === "members" ? { memberCount: -1 } : { createdAt: -1 };

    const [docs, total] = await Promise.all([
      ServerModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ServerModel.countDocuments(filter),
    ]);

    return {
      servers: docs.map((doc) => this._mapper.toDomain(doc as IServerPersistence)),
      total,
      page,
      limit,
    };
  }

  async findServerById(serverId: string): Promise<Server | null> {
    if (!Types.ObjectId.isValid(serverId)) return null;

    const doc = await ServerModel.findOne({
      _id: serverId,
      deletedAt: null,
    }).lean();

    return doc ? this._mapper.toDomain(doc as IServerPersistence) : null;
  }

  async disableServer(serverId: string): Promise<void> {
    await ServerModel.updateOne({ _id: serverId, deletedAt: null }, { $set: { isDisabled: true } });
  }

  async enableServer(serverId: string): Promise<void> {
    await ServerModel.updateOne(
      { _id: serverId, deletedAt: null },
      { $set: { isDisabled: false } },
    );
  }

  async deleteServer(serverId: string): Promise<void> {
    await ServerModel.updateOne(
      { _id: serverId },
      { $set: { deletedAt: new Date(), isDisabled: true } },
    );
  }
}
