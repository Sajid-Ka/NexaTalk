import { injectable } from "inversify";
import { ServerInvite } from "../../../../domain/features/servers/entities/ServerInvite";
import { IServerInviteRepository } from "../../../../domain/features/servers/repositories/IServerInviteRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { ServerInviteModel, IServerInvitePersistence } from "../database/ServerInviteModel";
import { ServerInvitePersistenceMapper } from "../mappers/ServerInviteMapper";

@injectable()
export class ServerInviteRepository
  extends BaseRepository<IServerInvitePersistence, ServerInvite>
  implements IServerInviteRepository
{
  constructor() {
    super(ServerInviteModel, new ServerInvitePersistenceMapper());
  }

  async findByCode(code: string): Promise<ServerInvite | null> {
    const doc = await this.model.findOne({ code }).lean();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async findByServer(serverId: string): Promise<ServerInvite[]> {
    const docs = await this.model.find({ serverId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async deleteExpired(): Promise<number> {
    const result = await this.model.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount;
  }

  async incrementUses(code: string): Promise<void> {
    await this.model.updateOne({ code }, { $inc: { uses: 1 } });
  }

  async deleteByServer(serverId: string): Promise<number> {
    const result = await this.model.deleteMany({ serverId });
    return result.deletedCount;
  }
}
