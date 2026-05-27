import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../main/di/modules/admin/admin.types";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IListServersUsecase } from "../../../application/admin/servers/interfaces/IListServersUsecase";
import { IGetServerDetailsUsecase } from "../../../application/admin/servers/interfaces/IGetServerDetailsUsecase";
import { IDisableServerUsecase } from "../../../application/admin/servers/interfaces/IDisableServerUsecase";
import { IEnableServerUsecase } from "../../../application/admin/servers/interfaces/IEnableServerUsecase";
import { IDeleteServerByAdminUsecase } from "../../../application/admin/servers/interfaces/IDeleteServerByAdminUsecase";

@injectable()
export class AdminServerController {
  constructor(
    @inject(ADMIN_TYPES.ListServers)
    private readonly _listServers: IListServersUsecase,

    @inject(ADMIN_TYPES.GetServerDetails)
    private readonly _getServerDetails: IGetServerDetailsUsecase,

    @inject(ADMIN_TYPES.DisableServer)
    private readonly _disableServer: IDisableServerUsecase,

    @inject(ADMIN_TYPES.EnableServer)
    private readonly _enableServer: IEnableServerUsecase,

    @inject(ADMIN_TYPES.DeleteServerByAdmin)
    private readonly _deleteServer: IDeleteServerByAdminUsecase,
  ) {}

  listServers = async (req: Request, res: Response) => {
    const result = await this._listServers.execute({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: req.query.search as string,
      status: req.query.status as "all" | "active" | "disabled",
      sort: req.query.sort as string,
    });

    res.json(successResponse(result, "Servers fetched"));
  };

  getServerDetails = async (req: Request, res: Response) => {
    const result = await this._getServerDetails.execute(req.params.id);

    res.json(successResponse(result, "Server details fetched"));
  };

  disableServer = async (req: Request, res: Response) => {
    await this._disableServer.execute(req.params.id);

    res.json(successResponse(null, "Server disabled"));
  };

  enableServer = async (req: Request, res: Response) => {
    await this._enableServer.execute(req.params.id);

    res.json(successResponse(null, "Server enabled"));
  };

  deleteServer = async (req: Request, res: Response) => {
    await this._deleteServer.execute(req.params.id);

    res.json(successResponse(null, "Server deleted"));
  };
}