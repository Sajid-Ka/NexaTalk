import { Response } from "express";
import { injectable, inject } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { ICreateServerInviteUsecase } from "../../../application/servers/invites/interfaces/ICreateServerInviteUsecase";
import { IJoinServerByInviteUsecase } from "../../../application/servers/invites/interfaces/IJoinServerByInviteUsecase";

@injectable()
export class ServerInviteController {
  constructor(
    @inject(SERVERS_TYPES.CreateServerInvite)
    private readonly _createServerInvite: ICreateServerInviteUsecase,
    @inject(SERVERS_TYPES.JoinServerByInvite)
    private readonly _joinServerByInvite: IJoinServerByInviteUsecase,
  ) {}

  createInvite = async (req: AuthenticatedRequest, res: Response) => {
    const maxUses = Number(req.body.maxUses) || 0;

    const expiresInDays = Number(req.body.expiresInDays) || 7;

    const invite = await this._createServerInvite.execute(
      req.params.serverId,
      req.user!.userId,
      maxUses,
      expiresInDays,
    );

    res.json(successResponse(invite, "Invite created successfully"));
  };

  joinByInvite = async (req: AuthenticatedRequest, res: Response) => {
    const server = await this._joinServerByInvite.execute(req.params.code, req.user!.userId);

    res.json(successResponse(server, "Joined server via invite successfully"));
  };
}
