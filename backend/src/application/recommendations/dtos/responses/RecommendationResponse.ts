import { UserWithInterestsResponse } from "../../../interests/dtos/responses/UserWithInterestsResponse";
import { ServerWithInterestsResponse } from "../../../interests/dtos/responses/ServerWithInterestsResponse";

export interface RecommendationResponse {
  people: UserWithInterestsResponse[];
  servers: ServerWithInterestsResponse[];
  refreshedAt: Date;
  isStale: boolean;
  disabled: boolean;
}
