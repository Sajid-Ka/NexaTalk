import { RecommendationType } from "../../../../shared/constants/recommendation.const";

export interface RecommendationRequest {
  limit?: number;
  type?: RecommendationType;
  refresh?: boolean;
}
