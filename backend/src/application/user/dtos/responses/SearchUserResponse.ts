import { UserPresenceStatus } from "../../../../shared/constants/user.const";

export interface SearchUserResponse {
  id: string;
  username: string;
  avatar?: string;
  status: UserPresenceStatus;
  isFriend?: boolean;
}
