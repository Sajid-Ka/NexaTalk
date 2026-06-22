import { ProfileResponse } from "./ProfileResponse";
import { PublicProfileResponse } from "./PublicProfileResponse";
import { UserRelationship } from "../../../../shared/constants/relationship.const";

export interface UserPreviewResponse {
  user: ProfileResponse | PublicProfileResponse;
  relationship: UserRelationship;
}
