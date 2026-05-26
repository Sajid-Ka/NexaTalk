import { Response } from "express";
import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetServerBansUsecase } from "../../../application/servers/bans/interfaces/IGetServerBansUsecase";
import { IBanServerMemberUsecase } from "../../../application/servers/bans/interfaces/IBanServerMemberUsecase";
import { IUnbanServerMemberUsecase } from "../../../application/servers/bans/interfaces/IUnbanServerMemberUsecase";
import { ISearchServerBanCandidatesUsecase } from "../../../application/servers/bans/interfaces/ISearchServerBanCandidatesUsecase";

@injectable()
export class ServerBanController {
  constructor(
    @inject(SERVERS_TYPES.GetServerBans) private readonly _getServerBans: IGetServerBansUsecase,
    @inject(SERVERS_TYPES.BanServerMember)
    private readonly _banServerMember: IBanServerMemberUsecase,
    @inject(SERVERS_TYPES.UnbanServerMember)
    private readonly _unbanServerMember: IUnbanServerMemberUsecase,
    @inject(SERVERS_TYPES.SearchServerBanCandidates)
    private readonly _searchServerBanCandidates: ISearchServerBanCandidatesUsecase,
  ) {}
  //featch banned users in a server
  getBans = async (req: AuthenticatedRequest, res: Response) => {
    const bans = await this._getServerBans.execute(req.params.serverId, req.user!.userId);

    res.json(successResponse(bans, "Server bans fetched successfully"));
  };

  banMember = async (req: AuthenticatedRequest, res: Response) => {
    const ban = await this._banServerMember.execute(
      req.params.serverId,
      req.user!.userId,
      req.body.userId,
      req.body.reason,
    );

    res.json(successResponse(ban, "User banned successfully"));
  };

  unbanMember = async (req: AuthenticatedRequest, res: Response) => {
    await this._unbanServerMember.execute(req.params.serverId, req.user!.userId, req.params.userId);

    res.json(successResponse(null, "User unbanned successfully"));
  };

  searchBanCandidates = async (req: AuthenticatedRequest, res: Response) => {
    const candidates = await this._searchServerBanCandidates.execute(
      req.params.serverId,
      req.user!.userId,
      String(req.query.q ?? ""),
    );

    res.json(successResponse(candidates, "Ban candidates fetched successfully"));
  };
}
