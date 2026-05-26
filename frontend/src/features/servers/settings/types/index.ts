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

export interface ServerBan {
  id: string;
  serverId: string;
  userId: string;
  username: string;
  avatar?: string;
  bannedBy: string;
  reason: string;
  createdAt: string;
}

export interface ServerBanCandidate {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  serverRole: ServerMemberRole | null;
}