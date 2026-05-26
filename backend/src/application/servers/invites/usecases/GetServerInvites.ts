import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerInviteRepository } from "../../../../domain/features/servers/repositories/IServerInviteRepository";
import { ServerInviteResponse } from "../dtos/responses/ServerInviteResponse";
import { IGetServerInvitesUsecase } from "../interfaces/IGetServerInvitesUsecase";
import { ServerInviteUtil } from "../../../../shared/utils/server-invite.util";
import { env } from "../../../../shared/config/env";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";

@injectable()
export class GetServerInvites implements IGetServerInvitesUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerInviteRepository)
    private readonly _inviteRepo: IServerInviteRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(serverId: string, userId: string): Promise<ServerInviteResponse[]> {
    this._logger.info("Fetching server invites", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const member = await this._memberRepo.findByServerAndUser(serverId, userId);

    if (!member) {
      throw new NotMemberError();
    }

    if (member.role !== ServerMemberRole.OWNER && member.role !== ServerMemberRole.ADMIN) {
      throw new InsufficientPermissionsError();
    }

    const invites = await this._inviteRepo.findByServer(serverId);

    return invites.map((invite) => ({
      id: invite.id,
      code: invite.code,
      serverId: invite.serverId,
      createdBy: invite.createdBy,
      maxUses: invite.maxUses,
      uses: invite.uses,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
      inviteUrl: ServerInviteUtil.generateInviteUrl(invite.code, env.CLIENT_ORIGIN),
    }));
  }
}
