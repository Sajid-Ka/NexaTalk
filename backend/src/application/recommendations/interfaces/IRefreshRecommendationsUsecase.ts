import { RecommendationResponse } from "../dtos/responses/RecommendationResponse";

export interface IRefreshRecommendationsUseCase {
  execute(userId: string): Promise<RecommendationResponse>;
}
