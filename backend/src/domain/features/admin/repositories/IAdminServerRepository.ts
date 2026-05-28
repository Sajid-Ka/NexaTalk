import { Server } from "../../servers/entities/Server";
import { AdminServerQuery } from "../types/AdminServerQuery";

export interface IAdminServerRepository {
  findServers(
    query: AdminServerQuery,
  ): Promise<{ servers: Server[]; total: number; page: number; limit: number }>;

  findServerById(serverId: string): Promise<Server | null>;

  disableServer(serverId: string): Promise<void>;

  enableServer(serverId: string): Promise<void>;

  deleteServer(serverId: string): Promise<void>;
}
