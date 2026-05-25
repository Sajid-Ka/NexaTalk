import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { ServerMember } from "../entities/ServerMember";
import { ServerMemberRole } from "../../../../shared/constants/server.const";

export interface IServerMemberRepository extends IBaseRepository<ServerMember> {
  findByServer(serverId: string): Promise<ServerMember[]>;
  findByUser(userId: string): Promise<ServerMember[]>;
  findByServerAndUser(serverId: string, userId: string): Promise<ServerMember | null>;
  updateRole(serverId: string, userId: string, role: ServerMemberRole): Promise<ServerMember>;
  isMember(serverId: string, userId: string): Promise<boolean>;
  getMemberCount(serverId: string): Promise<number>;
  getMembersWithRole(serverId: string, role: ServerMemberRole): Promise<ServerMember[]>;
  getAdmins(serverId: string): Promise<ServerMember[]>;
  transferOwnership(serverId: string, currentOwnerId: string, newOwnerId: string): Promise<void>;
  removeMember(serverId: string, userId: string): Promise<boolean>;
}
