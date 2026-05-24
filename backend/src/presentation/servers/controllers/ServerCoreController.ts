import { Response } from "express";
import { injectable, inject } from "inversify";

import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";

import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";

import { successResponse } from "../../../shared/response/responseFormatter";

import { ICreateServerUsecase } from "../../../application/servers/core/interfaces/ICreateServerUsecase";
import { IGetServerUsecase } from "../../../application/servers/core/interfaces/IGetServerUsecase";
import { IUpdateServerUsecase } from "../../../application/servers/core/interfaces/IUpdateServerUsecase";
import { IDeleteServerUsecase } from "../../../application/servers/core/interfaces/IDeleteServerUsecase";
import { IGetUserServersUsecase } from "../../../application/servers/core/interfaces/IGetUserServersUsecase";
import { IGetPublicServersUsecase } from "../../../application/servers/core/interfaces/IGetPublicServersUsecase";

import { CreateServerRequest } from "../../../application/servers/core/dtos/requests/CreateServerRequest";
import { UpdateServerRequest } from "../../../application/servers/core/dtos/requests/UpdateServerRequest";

@injectable()
export class ServerCoreController {
  constructor(
    @inject(SERVERS_TYPES.CreateServer)
    private readonly _createServer: ICreateServerUsecase,

    @inject(SERVERS_TYPES.GetServer)
    private readonly _getServer: IGetServerUsecase,

    @inject(SERVERS_TYPES.UpdateServer)
    private readonly _updateServer: IUpdateServerUsecase,

    @inject(SERVERS_TYPES.DeleteServer)
    private readonly _deleteServer: IDeleteServerUsecase,

    @inject(SERVERS_TYPES.GetUserServers)
    private readonly _getUserServers: IGetUserServersUsecase,

    @inject(SERVERS_TYPES.GetPublicServers)
    private readonly _getPublicServers: IGetPublicServersUsecase,
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
}
