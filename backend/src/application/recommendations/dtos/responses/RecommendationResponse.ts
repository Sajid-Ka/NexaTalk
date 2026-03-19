import {
  UserWithInterestsResponse,
  ServerWithInterestsResponse,
} from "../../../interests/dtos/responses/InterestResponse";

export interface RecommendationResponse {
  people: UserWithInterestsResponse[];
  servers: ServerWithInterestsResponse[];
  refreshedAt: Date;
  isStale: boolean;
  disabled: boolean;
}
