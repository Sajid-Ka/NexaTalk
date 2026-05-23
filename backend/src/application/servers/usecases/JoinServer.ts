import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../domain/features/servers/repositories/IServerMemberRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ServerMember } from "../../../domain/features/servers/entities/ServerMember";
import { IJoinServerUsecase } from "../interfaces/IJoinServerUsecase";
import { ServerResponse } from "../dtos/responses/ServerResponse";
import { ServerMapper } from "../mappers/ServerMapper";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { ServerMemberRole } from "../../../shared/constants/server.const";
import { ServerNotFoundError } from "../../../domain/features/servers/errors/ServerNotFoundError";
import { AlreadyMemberError } from "../../../domain/features/servers/errors/AlreadyMemberError";
import { InsufficientPermissionsError } from "../../../domain/features/servers/errors/InsufficientPermissionsError";
import { ITransactionManager } from "../../../domain/core/common/services/ITransactionManager";

@injectable()
export class JoinServer implements IJoinServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(serverId: string, userId: string): Promise<ServerResponse> {
    this._logger.info("Joining server", { serverId, userId });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const server = await this._serverRepo.findById(serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    if (server.isPrivate()) {
      throw new InsufficientPermissionsError("Private servers require invite access");
    }

    const existingMember = await this._memberRepo.findByServerAndUser(serverId, userId);
    if (existingMember) {
      throw new AlreadyMemberError();
    }

    // Add member
    const member = new ServerMember({
      serverId,
      userId,
      role: ServerMemberRole.MEMBER,
    });

    await this._transactionManager.run(async (session) => {
      await this._memberRepo.create(member, session);
      await this._serverRepo.incrementMemberCount(serverId, session);
    });

    // Get updated server
    const updatedServer = await this._serverRepo.findById(serverId);
    if (!updatedServer) {
      throw new ServerNotFoundError();
    }

    this._logger.info("User joined server", { serverId, userId });

    return ServerMapper.toResponse(updatedServer);
  }
}
