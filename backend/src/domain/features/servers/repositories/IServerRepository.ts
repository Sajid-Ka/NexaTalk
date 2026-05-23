import { ClientSession } from "mongoose";
import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Server } from "../entities/Server";

export interface IServerRepository extends IBaseRepository<Server> {
  findByOwner(ownerId: string): Promise<Server[]>;
  findPublicServers(limit?: number, offset?: number): Promise<Server[]>;
  search(query: string, limit?: number): Promise<Server[]>;
  incrementMemberCount(serverId: string, session?: ClientSession): Promise<void>;
  decrementMemberCount(serverId: string, session?: ClientSession): Promise<void>;
  findByUser(userId: string): Promise<Server[]>;
  findByIdWithMembers(serverId: string): Promise<Server | null>;
  updateOwner(serverId: string, ownerId: string, session?: ClientSession): Promise<void>;
}
