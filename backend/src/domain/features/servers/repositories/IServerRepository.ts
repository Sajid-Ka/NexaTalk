import { TransactionContext } from "../../../core/common/services/TransactionContext";
import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Server } from "../entities/Server";

import { ServerTag } from "../../../../shared/constants/server.const";

export interface PublicServerFilters {
  tag?: ServerTag;
  search?: string;
}

export interface IServerRepository extends IBaseRepository<Server> {
  findByOwner(ownerId: string): Promise<Server[]>;
  findPublicServers(
    limit?: number,
    offset?: number,
    filters?: PublicServerFilters,
  ): Promise<Server[]>;
  search(query: string, limit?: number): Promise<Server[]>;
  incrementMemberCount(serverId: string, transaction?: TransactionContext): Promise<void>;
  decrementMemberCount(serverId: string, transaction?: TransactionContext): Promise<void>;
  findByUser(userId: string): Promise<Server[]>;
  findByIdWithMembers(serverId: string): Promise<Server | null>;
  updateOwner(serverId: string, ownerId: string, transaction?: TransactionContext): Promise<void>;
}
