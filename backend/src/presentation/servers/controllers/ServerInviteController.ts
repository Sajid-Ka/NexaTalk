import { Response } from "express";
import { injectable, inject } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { ICreateServerInviteUsecase } from "../../../application/servers/invites/interfaces/ICreateServerInviteUsecase";
import { IJoinServerByInviteUsecase } from "../../../application/servers/invites/interfaces/IJoinServerByInviteUsecase";
import { IGetServerInvitesUsecase } from "../../../application/servers/invites/interfaces/IGetServerInvitesUsecase";
import { IRevokeServerInviteUsecase } from "../../../application/servers/invites/interfaces/IRevokeServerInviteUsecase";

@injectable()
export class ServerInviteController {
  constructor(
    @inject(SERVERS_TYPES.CreateServerInvite)
    private readonly _createServerInvite: ICreateServerInviteUsecase,
    @inject(SERVERS_TYPES.JoinServerByInvite)
    private readonly _joinServerByInvite: IJoinServerByInviteUsecase,
    @inject(SERVERS_TYPES.GetServerInvites)
    private readonly _getServerInvites: IGetServerInvitesUsecase,
    @inject(SERVERS_TYPES.RevokeServerInvite)
    private readonly _revokeServerInvite: IRevokeServerInviteUsecase,
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

  getInvites = async (req: AuthenticatedRequest, res: Response) => {
    const invites = await this._getServerInvites.execute(req.params.serverId, req.user!.userId);

    res.json(successResponse(invites, "Server invites fetched successfully"));
  };

  revokeInvite = async (req: AuthenticatedRequest, res: Response) => {
    await this._revokeServerInvite.execute(
      req.params.serverId,
      req.user!.userId,
      req.params.inviteId,
    );

    res.json(successResponse(null, "Invite revoked successfully"));
  };

  joinByInvite = async (req: AuthenticatedRequest, res: Response) => {
    const server = await this._joinServerByInvite.execute(req.params.code, req.user!.userId);

    res.json(successResponse(server, "Joined server via invite successfully"));
  };
}
