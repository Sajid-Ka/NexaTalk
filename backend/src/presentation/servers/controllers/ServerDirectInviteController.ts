import { Response } from "express";
import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { ISendDirectServerInviteUsecase } from "../../../application/servers/invites/interfaces/ISendDirectServerInviteUsecase";
import { IGetPendingDirectInvitesUsecase } from "../../../application/servers/invites/interfaces/IGetPendingDirectInvitesUsecase";
import { IGetSentDirectInvitesUsecase } from "../../../application/servers/invites/interfaces/IGetSentDirectInvitesUsecase";
import { IRespondToDirectInviteUsecase } from "../../../application/servers/invites/interfaces/IRespondToDirectInviteUsecase";

@injectable()
export class ServerDirectInviteController {
  constructor(
    @inject(SERVERS_TYPES.SendDirectServerInvite)
    private readonly _sendInvite: ISendDirectServerInviteUsecase,
    @inject(SERVERS_TYPES.GetPendingDirectInvites)
    private readonly _getPending: IGetPendingDirectInvitesUsecase,
    @inject(SERVERS_TYPES.GetSentDirectInvites)
    private readonly _getSent: IGetSentDirectInvitesUsecase,
    @inject(SERVERS_TYPES.RespondToDirectInvite)
    private readonly _respond: IRespondToDirectInviteUsecase,
  ) {}

  sendInvite = async (req: AuthenticatedRequest, res: Response) => {
    const invite = await this._sendInvite.execute(
      req.params.serverId,
      req.user!.userId,
      req.body.friendId,
    );

    res.json(successResponse(invite, "Invite sent successfully"));
  };

  getPendingInvites = async (req: AuthenticatedRequest, res: Response) => {
    const invites = await this._getPending.execute(req.user!.userId);
    res.json(successResponse(invites, "Pending invites fetched successfully"));
  };

  getServerPendingInvites = async (req: AuthenticatedRequest, res: Response) => {
    const invites = await this._getSent.execute(req.params.serverId, req.user!.userId);
    res.json(successResponse(invites, "Server pending invites fetched"));
  };

  respondToInvite = async (req: AuthenticatedRequest, res: Response) => {
    await this._respond.execute(req.params.inviteId, req.user!.userId, req.body.status);
    res.json(successResponse(null, `Invite ${req.body.status} successfully`));
  };
}
