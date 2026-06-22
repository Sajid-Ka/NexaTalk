import { UserPresenceStatus } from "../../../../shared/constants/userPresenceStatus.const";
import { GlobalRole } from "../../../../shared/constants/userRole.const";
import { InterestResponse } from "../../../interests/dtos/responses/InterestResponse";

export interface PublicProfileResponse {
  id: string;
  username: string;
  avatar?: string;
  bio?: string;
  status: UserPresenceStatus;
  globalRole: GlobalRole;
  lastSeenAt?: Date;
  interests?: InterestResponse[];
  createdAt: Date;
}
