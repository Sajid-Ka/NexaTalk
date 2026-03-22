import { UserPresenceStatus } from "../../../../shared/constants/userPresenceStatus.const";

export interface SearchUserResponse {
  id: string;
  username: string;
  avatar?: string;
  status: UserPresenceStatus;
}
