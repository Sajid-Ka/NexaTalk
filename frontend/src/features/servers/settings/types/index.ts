import { ServerMemberRole } from "../../../../shared/constants/server.const";

export interface ServerSettingsMember {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  status: string;
  role: ServerMemberRole;
  joinedAt: string;
}