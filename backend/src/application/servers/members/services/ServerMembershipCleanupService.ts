import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerMembershipCleanupService } from "../interfaces/IServerMembershipCleanupService";

@injectable()
export class ServerMembershipCleanupService implements IServerMembershipCleanupService {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
  ) {}

  async removeMemberAndDecrementCount(serverId: string, userId: string): Promise<void> {
    const removed = await this._memberRepo.removeMember(serverId, userId);
    if (removed) {
      await this._serverRepo.decrementMemberCount(serverId);
    }
  }
}
