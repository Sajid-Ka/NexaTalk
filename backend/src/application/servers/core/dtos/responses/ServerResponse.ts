import {
  ServerPrivacy,
  ServerMemberRole,
  ServerTag,
} from "../../../../../shared/constants/server.const";
import { UserPresenceStatus } from "../../../../../shared/constants/userPresenceStatus.const";

export interface ServerMemberResponse {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  status: UserPresenceStatus;
  role: ServerMemberRole;
  joinedAt: Date;
}

export interface ServerResponse {
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
  tag: ServerTag;
  members?: ServerMemberResponse[];
  userRole?: ServerMemberRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServerInviteResponse {
  id: string;
  code: string;
  serverId: string;
  createdBy: string;
  maxUses: number;
  expiresAt: Date | null;
  uses: number;
  createdAt: Date;
  inviteUrl: string;
}
