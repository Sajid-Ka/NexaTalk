import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerInviteRepository } from "../../../../domain/features/servers/repositories/IServerInviteRepository";
import { ServerInvite } from "../../../../domain/features/servers/entities/ServerInvite";
import { ICreateServerInviteUsecase } from "../interfaces/ICreateServerInviteUsecase";
import { ServerInviteResponse } from "../dtos/responses/ServerInviteResponse";
import { ServerInviteUtil } from "../../../../shared/utils/server-invite.util";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { env } from "../../../../shared/config/env";
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";

@injectable()
export class CreateServerInvite implements ICreateServerInviteUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerInviteRepository)
    private readonly _inviteRepo: IServerInviteRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    serverId: string,
    userId: string,
    maxUses: number = 0,
    expiresInDays: number = 7,
  ): Promise<ServerInviteResponse> {
    this._logger.info("Creating server invite", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);
    if (!server) {
      throw new NotFoundError("Server not found");
    }

    // Check if user is a member (only members can create invites)
    const member = await this._memberRepo.findByServerAndUser(serverId, userId);
    if (!member) {
      throw new ForbiddenError("You must be a member of the server to create invites");
    }

    const code = ServerInviteUtil.generateCode();
    const expiresAt =
      expiresInDays > 0 ? ServerInviteUtil.calculateExpiryDate(expiresInDays) : null;

    const invite = new ServerInvite({
      serverId,
      code,
      createdBy: userId,
      maxUses,
      expiresAt,
    });

    const createdInvite = await this._inviteRepo.create(invite);
    const inviteUrl = ServerInviteUtil.generateInviteUrl(code, env.CLIENT_ORIGIN);

    this._logger.info("Server invite created", { serverId, code });

    await this._auditLogRepo.create(
      new ServerAuditLog({
        serverId,
        actorId: userId,
        action: "INVITE_CREATED",
        targetId: createdInvite.id,
        metadata: {
          code: createdInvite.code,
          maxUses: createdInvite.maxUses,
          expiresAt: createdInvite.expiresAt,
        },
      }),
    );

    return {
      id: createdInvite.id,
      code: createdInvite.code,
      serverId: createdInvite.serverId,
      createdBy: createdInvite.createdBy,
      maxUses: createdInvite.maxUses,
      expiresAt: createdInvite.expiresAt,
      uses: createdInvite.uses,
      createdAt: createdInvite.createdAt,
      inviteUrl,
    };
  }
}
