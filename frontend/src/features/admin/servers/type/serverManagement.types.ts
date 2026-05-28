import type { ServerPrivacy } from "../../../../shared/constants/server.const";

export interface AdminServer {
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
  createdAt: string;
  updatedAt: string;
}

export interface ServerTableRow {
  id: string;
  name: string;
  initials: string;
  ownerUsername: string;
  memberCount: number;
  privacy: ServerPrivacy;
  createdDate: string;
  raw: AdminServer;
}