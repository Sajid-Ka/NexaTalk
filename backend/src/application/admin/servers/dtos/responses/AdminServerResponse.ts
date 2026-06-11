import { ServerPrivacy, ServerTag } from "../../../../../shared/constants/server.const";

export interface AdminServerResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  ownerUsername: string;
  privacy: ServerPrivacy;
  isDisabled: boolean;
  memberCount: number;
  tag: ServerTag;
  createdAt: Date;
  updatedAt: Date;
}
