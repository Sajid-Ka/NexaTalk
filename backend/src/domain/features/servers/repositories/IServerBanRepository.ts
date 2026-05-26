import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { ServerBan } from "../entities/ServerBan";

export interface IServerBanRepository extends IBaseRepository<ServerBan> {
  //Get all banned users in a server, used in server settings ban page.
  findByServer(serverId: string): Promise<ServerBan[]>;
  //check a specific user is banned or not in a server, (avoiding duplicate ban)
  findByServerAndUser(serverId: string, userId: string): Promise<ServerBan | null>;
  //unban a user, unban already banned user.
  deleteByServerAndUser(serverId: string, userId: string): Promise<boolean>;
  //Remove all bans in a server while the server deleting time.
  deleteByServer(serverId: string): Promise<number>;
}
