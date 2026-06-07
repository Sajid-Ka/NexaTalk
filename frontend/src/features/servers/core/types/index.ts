import { ServerPrivacy } from "../../../../shared/constants/server.const";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { UserPresence } from "../../../../shared/constants/user.const";

export interface ServerMember {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  status: UserPresence;
  role: ServerMemberRole;
  joinedAt: string;
}

export interface Server {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  privacy: ServerPrivacy;
  isDisabled: boolean;
  memberCount: number;
  channelCount?: number;
  ownerName?: string;
  tags: string[];
  members?: ServerMember[];
  userRole?: ServerMemberRole;
  createdAt: string;
  updatedAt: string;
}

export interface ServerInvite {
  id: string;
  code: string;
  serverId: string;
  createdBy: string;
  maxUses: number;
  expiresAt: string | null;
  uses: number;
  createdAt: string;
  inviteUrl: string;
}

export interface CreateServerRequest {
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  privacy: ServerPrivacy;
  tags?: string[];
}
