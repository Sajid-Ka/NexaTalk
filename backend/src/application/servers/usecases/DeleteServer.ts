import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerInviteRepository } from "../../../domain/features/servers/repositories/IServerInviteRepository";
import { IDeleteServerUsecase } from "../interfaces/IDeleteServerUsecase";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ServerNotFoundError } from "../../../domain/features/servers/errors/ServerNotFoundError";
import { InsufficientPermissionsError } from "../../../domain/features/servers/errors/InsufficientPermissionsError";
import { ITransactionManager } from "../../../domain/core/common/services/ITransactionManager";

@injectable()
export class DeleteServer implements IDeleteServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerInviteRepository)
    private readonly _inviteRepo: IServerInviteRepository,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(serverId: string, userId: string): Promise<void> {
    this._logger.info("Deleting server", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    // Only owner can delete server
    if (!server.isOwner(userId)) {
      throw new InsufficientPermissionsError();
    }

    await this._transactionManager.run(async (session) => {
      // Soft delete the server
      await this._serverRepo.update(serverId, { deletedAt: new Date() }, session);

      // Delete all invites
      await this._inviteRepo.deleteByServer(serverId, session);
    });

    this._logger.info("Server deleted", { serverId, userId });
  }
}
