import { RecommendationType } from "../../../../shared/constants/recommendation-type.const";

export interface RecommendationRequest {
  limit?: number;
  type?: RecommendationType;
  refresh?: boolean;
}
