import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { ServerAuditLog } from "../entities/ServerAuditLog";

export interface IServerAuditLogRepository extends IBaseRepository<ServerAuditLog> {
  findByServer(serverId: string, limit?: number, offset?: number): Promise<ServerAuditLog[]>;
}
