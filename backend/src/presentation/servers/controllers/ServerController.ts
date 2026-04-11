import { Response } from "express";
import { injectable, inject } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { ICreateServerUsecase } from "../../../application/servers/interfaces/ICreateServerUsecase";
import { IGetServerUsecase } from "../../../application/servers/interfaces/IGetServerUsecase";
import { IUpdateServerUsecase } from "../../../application/servers/interfaces/IUpdateServerUsecase";
import { IDeleteServerUsecase } from "../../../application/servers/interfaces/IDeleteServerUsecase";
import { IJoinServerUsecase } from "../../../application/servers/interfaces/IJoinServerUsecase";
import { ILeaveServerUsecase } from "../../../application/servers/interfaces/ILeaveServerUsecase";
import { IGetUserServersUsecase } from "../../../application/servers/interfaces/IGetUserServersUsecase";
import { IGetPublicServersUsecase } from "../../../application/servers/interfaces/IGetPublicServersUsecase";
import { ICreateServerInviteUsecase } from "../../../application/servers/interfaces/ICreateServerInviteUsecase";
import { IJoinServerByInviteUsecase } from "../../../application/servers/interfaces/IJoinServerByInviteUsecase";
import { CreateServerRequest } from "../../../application/servers/dtos/requests/CreateServerRequest";
import { UpdateServerRequest } from "../../../application/servers/dtos/requests/UpdateServerRequest";

@injectable()
export class ServerController {
  constructor(
    @inject(SERVERS_TYPES.CreateServer) private readonly _createServer: ICreateServerUsecase,
    @inject(SERVERS_TYPES.GetServer) private readonly _getServer: IGetServerUsecase,
    @inject(SERVERS_TYPES.UpdateServer) private readonly _updateServer: IUpdateServerUsecase,
    @inject(SERVERS_TYPES.DeleteServer) private readonly _deleteServer: IDeleteServerUsecase,
    @inject(SERVERS_TYPES.JoinServer) private readonly _joinServer: IJoinServerUsecase,
    @inject(SERVERS_TYPES.LeaveServer) private readonly _leaveServer: ILeaveServerUsecase,
    @inject(SERVERS_TYPES.GetUserServers) private readonly _getUserServers: IGetUserServersUsecase,
    @inject(SERVERS_TYPES.GetPublicServers)
    private readonly _getPublicServers: IGetPublicServersUsecase,
    @inject(SERVERS_TYPES.CreateServerInvite)
    private readonly _createServerInvite: ICreateServerInviteUsecase,
    @inject(SERVERS_TYPES.JoinServerByInvite)
    private readonly _joinServerByInvite: IJoinServerByInviteUsecase,
  ) {}

  createServer = async (req: AuthenticatedRequest, res: Response) => {
    const request: CreateServerRequest = {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      banner: req.body.banner,
      privacy: req.body.privacy,
      tags: req.body.tags,
    };

    const server = await this._createServer.execute(req.user!.userId, request);
    res.json(successResponse(server, "Server created successfully"));
  };

  getServer = async (req: AuthenticatedRequest, res: Response) => {
    const server = await this._getServer.execute(req.params.serverId, req.user?.userId);
    res.json(successResponse(server, "Server fetched successfully"));
  };

  updateServer = async (req: AuthenticatedRequest, res: Response) => {
    const request: UpdateServerRequest = {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      banner: req.body.banner,
      privacy: req.body.privacy,
      tags: req.body.tags,
    };

    const server = await this._updateServer.execute(req.params.serverId, req.user!.userId, request);
    res.json(successResponse(server, "Server updated successfully"));
  };

  deleteServer = async (req: AuthenticatedRequest, res: Response) => {
    await this._deleteServer.execute(req.params.serverId, req.user!.userId);
    res.json(successResponse(null, "Server deleted successfully"));
  };

  joinServer = async (req: AuthenticatedRequest, res: Response) => {
    const server = await this._joinServer.execute(req.params.serverId, req.user!.userId);
    res.json(successResponse(server, "Joined server successfully"));
  };

  leaveServer = async (req: AuthenticatedRequest, res: Response) => {
    await this._leaveServer.execute(req.params.serverId, req.user!.userId);
    res.json(successResponse(null, "Left server successfully"));
  };

  getUserServers = async (req: AuthenticatedRequest, res: Response) => {
    const servers = await this._getUserServers.execute(req.user!.userId);
    res.json(successResponse(servers, "User servers fetched successfully"));
  };

  getPublicServers = async (req: AuthenticatedRequest, res: Response) => {
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const servers = await this._getPublicServers.execute(limit, offset);
    res.json(successResponse(servers, "Public servers fetched successfully"));
  };

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
