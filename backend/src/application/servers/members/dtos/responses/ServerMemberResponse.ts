import { ServerMemberRole } from "../../../../../shared/constants/server.const";
import { UserPresenceStatus } from "../../../../../shared/constants/user.const";

export interface ServerMemberResponse {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  status: UserPresenceStatus;
  role: ServerMemberRole;
  joinedAt: Date;
}
