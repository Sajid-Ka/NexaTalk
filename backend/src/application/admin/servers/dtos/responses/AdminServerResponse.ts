import { ServerPrivacy } from "../../../../../shared/constants/server.const";

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
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
