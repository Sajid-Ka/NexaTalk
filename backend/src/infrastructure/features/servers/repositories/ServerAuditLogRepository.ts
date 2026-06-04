import { injectable } from "inversify";
import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { ServerAuditLogModel, IServerAuditLogPersistence } from "../models/ServerAuditLogModel";
import { ServerAuditLogPersistenceMapper } from "../mappers/ServerAuditLogMapper";

@injectable()
export class ServerAuditLogRepository
  extends BaseRepository<IServerAuditLogPersistence, ServerAuditLog>
  implements IServerAuditLogRepository
{
  constructor() {
    super(ServerAuditLogModel, new ServerAuditLogPersistenceMapper());
  }

  async findByServer(
    serverId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ServerAuditLog[]> {
    const docs = await this.model
      .find({ serverId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }
}
