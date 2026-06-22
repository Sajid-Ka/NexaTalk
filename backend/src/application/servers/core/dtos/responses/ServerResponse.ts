import {
  ServerPrivacy,
  ServerMemberRole,
  ServerTag,
} from "../../../../../shared/constants/server.const";
import { ServerMemberResponse } from "../../../members/dtos/responses/ServerMemberResponse";

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
