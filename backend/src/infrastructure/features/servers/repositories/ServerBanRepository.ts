import { injectable } from "inversify";
import { ServerBan } from "../../../../domain/features/servers/entities/ServerBan";
import { IServerBanRepository } from "../../../../domain/features/servers/repositories/IServerBanRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { ServerBanModel, IServerBanPersistence } from "../models/ServerBanModel";
import { ServerBanPersistenceMapper } from "../mappers/ServerBanMapper";

@injectable()
export class ServerBanRepository
  extends BaseRepository<IServerBanPersistence, ServerBan>
  implements IServerBanRepository
{
  constructor() {
    super(ServerBanModel, new ServerBanPersistenceMapper());
  }
  //find (fetch) banned users from a server
  async findByServer(serverId: string): Promise<ServerBan[]> {
    const docs = await this.model.find({ serverId }).sort({ createdAt: -1 }).lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findByServerAndUser(serverId: string, userId: string): Promise<ServerBan | null> {
    const doc = await this.model.findOne({ serverId, userId }).lean();

    return doc ? this.mapper.toDomain(doc) : null;
  }

  async deleteByServerAndUser(serverId: string, userId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ serverId, userId });

    return result.deletedCount > 0;
  }

  async deleteByServer(serverId: string): Promise<number> {
    const result = await this.model.deleteMany({ serverId });

    return result.deletedCount;
  }
}
