import { Response } from "express";
import { injectable, inject } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IJoinServerUsecase } from "../../../application/servers/members/interfaces/IJoinServerUsecase";
import { ILeaveServerUsecase } from "../../../application/servers/members/interfaces/ILeaveServerUsecase";
import { IGetServerMembersUsecase } from "../../../application/servers/members/interfaces/IGetServerMembersUsecase";

@injectable()
export class ServerMemberController {
  constructor(
    @inject(SERVERS_TYPES.JoinServer) private readonly _joinServer: IJoinServerUsecase,
    @inject(SERVERS_TYPES.LeaveServer) private readonly _leaveServer: ILeaveServerUsecase,
    @inject(SERVERS_TYPES.GetServerMembers)
    private readonly _getServerMembers: IGetServerMembersUsecase,
  ) {}

  joinServer = async (req: AuthenticatedRequest, res: Response) => {
    const server = await this._joinServer.execute(req.params.serverId, req.user!.userId);

    res.json(successResponse(server, "Joined server successfully"));
  };

  leaveServer = async (req: AuthenticatedRequest, res: Response) => {
    await this._leaveServer.execute(req.params.serverId, req.user!.userId);

    res.json(successResponse(null, "Left server successfully"));
  };

  getMembers = async (req: AuthenticatedRequest, res: Response) => {
    const members = await this._getServerMembers.execute(req.params.serverId, req.user!.userId);

    res.json(successResponse(members, "Server members fetched successfully"));
  };
}
