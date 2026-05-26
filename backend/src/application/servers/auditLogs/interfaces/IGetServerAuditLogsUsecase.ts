import { ServerAuditLogResponse } from "../dtos/responses/ServerAuditLogResponse";

export interface IGetServerAuditLogsUsecase {
  execute(
    serverId: string,
    currentUserId: string,
    limit?: number,
    offset?: number,
  ): Promise<ServerAuditLogResponse[]>;
}
