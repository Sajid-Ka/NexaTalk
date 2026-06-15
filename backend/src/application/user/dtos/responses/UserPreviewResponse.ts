import { ProfileResponse, PublicProfileResponse } from "./ProfileResponse";
import { UserRelationship } from "../../../../shared/constants/relationship.const";

export interface UserPreviewResponse {
  user: ProfileResponse | PublicProfileResponse;
  relationship: UserRelationship;
}
