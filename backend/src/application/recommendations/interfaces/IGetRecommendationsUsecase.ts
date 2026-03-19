import { RecommendationRequest } from "../dtos/requests/RecommendationRequest";
import { RecommendationResponse } from "../dtos/responses/RecommendationResponse";

export interface IGetRecommendationsUseCase {
  execute(userId: string, request: RecommendationRequest): Promise<RecommendationResponse>;
}
