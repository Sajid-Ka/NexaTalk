import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { ILeaveServerUsecase } from "../interfaces/ILeaveServerUsecase";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { CannotRemoveOwnerError } from "../../../../domain/features/servers/errors/CannotRemoveOwnerError";

@injectable()
export class LeaveServer implements ILeaveServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(serverId: string, userId: string): Promise<void> {
    this._logger.info("Leaving server", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    // Check if user is a member
    const member = await this._memberRepo.findByServerAndUser(serverId, userId);
    if (!member) {
      throw new NotMemberError();
    }

    // Owner cannot leave without transferring ownership
    if (server.isOwner(userId)) {
      throw new CannotRemoveOwnerError();
    }

    await this._memberRepo.delete(member.id);
    await this._serverRepo.decrementMemberCount(serverId);

    this._logger.info("User left server", { serverId, userId });
  }
}
