import { ClientSession } from "mongoose";
import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { ServerInvite } from "../entities/ServerInvite";

export interface IServerInviteRepository extends IBaseRepository<ServerInvite> {
  findByCode(code: string): Promise<ServerInvite | null>;
  findByServer(serverId: string): Promise<ServerInvite[]>;
  deleteExpired(): Promise<number>;
  incrementUses(code: string): Promise<void>;
  deleteByServer(serverId: string, session?: ClientSession): Promise<number>;
}
