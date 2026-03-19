import { Response } from "express";
import { injectable, inject } from "inversify";
import { RECOMMENDATIONS_TYPES } from "../../../main/di/modules/recommendations/recommendations.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetRecommendationsUseCase } from "../../../application/recommendations/interfaces/IGetRecommendationsUsecase";
import { RecommendationRequest } from "../../../application/recommendations/dtos/requests/RecommendationRequest";
import { RecommendationType } from "../../../shared/constants/recommendation-type.const";

@injectable()
export class RecommendationController {
  constructor(
    @inject(RECOMMENDATIONS_TYPES.GetRecommendations)
    private readonly _getRecommendations: IGetRecommendationsUseCase,
  ) {}

  getRecommendations = async (req: AuthenticatedRequest, res: Response) => {
    const request: RecommendationRequest = {
      limit: Number(req.query.limit) || 10,
      type: (req.query.type as RecommendationType) || RecommendationType.BOTH,
      refresh: req.query.refresh === "true",
    };

    const recommendations = await this._getRecommendations.execute(req.user!.userId, request);

    res.json(successResponse(recommendations, "Recommendations fetched successfully"));
  };
}
