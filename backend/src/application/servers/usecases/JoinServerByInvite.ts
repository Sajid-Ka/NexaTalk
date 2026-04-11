import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerInviteRepository } from "../../../domain/features/servers/repositories/IServerInviteRepository";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { ServerMember } from "../../../domain/features/servers/entities/ServerMember";
import { IJoinServerByInviteUsecase } from "../interfaces/IJoinServerByInviteUsecase";
import { ServerResponse } from "../dtos/responses/ServerResponse";
import { ServerMapper } from "../mappers/ServerMapper";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { ServerNotFoundError } from "../../../domain/features/servers/errors/ServerNotFoundError";
import { AlreadyMemberError } from "../../../domain/features/servers/errors/AlreadyMemberError";
import { InviteInvalidError } from "../../../domain/features/servers/errors/InviteInvalidError";
import { InviteExpiredError } from "../../../domain/features/servers/errors/InviteExpiredError";
import { InviteMaxUsesReachedError } from "../../../domain/features/servers/errors/InviteMaxUsesReachedError";
import { ServerMemberRole } from "../../../shared/constants/server.const";

@injectable()
export class JoinServerByInvite implements IJoinServerByInviteUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerInviteRepository)
    private readonly _inviteRepo: IServerInviteRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(code: string, userId: string): Promise<ServerResponse> {
    this._logger.info("Joining server via invite", { code, userId });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const invite = await this._inviteRepo.findByCode(code);
    if (!invite) {
      throw new InviteInvalidError();
    }

    // Check if invite is valid
    if (!invite.isValid()) {
      if (invite.expiresAt && invite.expiresAt.getTime() <= Date.now()) {
        throw new InviteExpiredError();
      }
      if (invite.maxUses > 0 && invite.uses >= invite.maxUses) {
        throw new InviteMaxUsesReachedError();
      }
      throw new InviteInvalidError();
    }

    const server = await this._serverRepo.findById(invite.serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    if (server.isDisabled) {
      throw new ServerNotFoundError();
    }

    const existingMember = await this._memberRepo.findByServerAndUser(server.id, userId);
    if (existingMember) {
      throw new AlreadyMemberError();
    }

    const member = new ServerMember({
      serverId: server.id,
      userId,
      role: ServerMemberRole.MEMBER,
    });

    await this._memberRepo.create(member);
    await this._serverRepo.incrementMemberCount(server.id);

    // Increment invite usage
    await this._inviteRepo.incrementUses(code);

    const updatedServer = await this._serverRepo.findById(server.id);
    if (!updatedServer) {
      throw new ServerNotFoundError();
    }

    this._logger.info("User joined server via invite", { serverId: server.id, userId, code });

    return ServerMapper.toResponse(updatedServer);
  }
}
