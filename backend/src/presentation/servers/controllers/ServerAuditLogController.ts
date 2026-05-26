import { Response } from "express";
import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetServerAuditLogsUsecase } from "../../../application/servers/auditLogs/interfaces/IGetServerAuditLogsUsecase";

@injectable()
export class ServerAuditLogController {
  constructor(
    @inject(SERVERS_TYPES.GetServerAuditLogs)
    private readonly _getServerAuditLogs: IGetServerAuditLogsUsecase,
  ) {}

  getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const logs = await this._getServerAuditLogs.execute(
      req.params.serverId,
      req.user!.userId,
      limit,
      offset,
    );

    res.json(successResponse(logs, "Server audit logs fetched successfully"));
  };
}
