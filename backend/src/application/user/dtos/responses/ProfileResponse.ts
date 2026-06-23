import { UserPresenceStatus } from "../../../../shared/constants/user.const";
import { GlobalRole } from "../../../../shared/constants/user.const";
import { InterestResponse } from "../../../interests/dtos/responses/InterestResponse";

export interface ProfileResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  status: UserPresenceStatus;
  globalRole: GlobalRole;
  showOnlineStatus: boolean;
  lastSeenAt?: Date;
  isProfilePublic: boolean;
  interests?: InterestResponse[];
  createdAt: Date;
  updatedAt: Date;
}
