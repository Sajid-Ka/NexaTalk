import { Response } from "express";
import { injectable, inject } from "inversify";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetRecommendedUsersUsecase } from "../../../application/recommendations/interfaces/IGetRecommendedUsersUsecase";
import { IGetRecommendedServersUsecase } from "../../../application/recommendations/interfaces/IGetRecommendedServersUsecase";

@injectable()
export class RecommendationV1Controller {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.GetRecommendedUsers)
    private readonly _getRecommendedUsers: IGetRecommendedUsersUsecase,
    @inject(RECOMMENDATIONS_TYPES.GetRecommendedServers)
    private readonly _getRecommendedServers: IGetRecommendedServersUsecase,
  ) {}

  getRecommendedUsers = async (req: AuthenticatedRequest, res: Response) => {
    const limit = Number(req.query.limit) || 5;
    const users = await this._getRecommendedUsers.execute(req.user!.userId, limit);
    res.json(successResponse(users, "Recommended users fetched successfully"));
  };

  getRecommendedServers = async (req: AuthenticatedRequest, res: Response) => {
    const limit = Number(req.query.limit) || 5;
    const servers = await this._getRecommendedServers.execute(req.user!.userId, limit);
    res.json(successResponse(servers, "Recommended servers fetched successfully"));
  };
}
