import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerMembershipCleanupService } from "../../members/interfaces/IServerMembershipCleanupService";
import { IServerBanRepository } from "../../../../domain/features/servers/repositories/IServerBanRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { ServerBan } from "../../../../domain/features/servers/entities/ServerBan";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { BadRequestError } from "../../../../domain/core/errors/BadRequestError";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { CannotRemoveOwnerError } from "../../../../domain/features/servers/errors/CannotRemoveOwnerError";
import { IBanServerMemberUsecase } from "../interfaces/IBanServerMemberUsecase";
import { ServerBanResponse } from "../dtos/responses/ServerBanResponse";
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";

@injectable()
export class BanServerMember implements IBanServerMemberUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerBanRepository) private readonly _banRepo: IServerBanRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(SERVERS_TYPES.ServerMembershipCleanupService)
    private readonly _membershipCleanupService: IServerMembershipCleanupService,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
  ) {}

  async execute(
    serverId: string,
    currentUserId: string,
    targetUserId: string,
    reason: string = "",
  ): Promise<ServerBanResponse> {
    if (currentUserId === targetUserId) {
      throw new BadRequestError("You cannot ban yourself");
    }

    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const currentMember = await this._memberRepo.findByServerAndUser(serverId, currentUserId);

    if (!currentMember) {
      throw new NotMemberError();
    }

    const canBan =
      currentMember.role === ServerMemberRole.OWNER ||
      currentMember.role === ServerMemberRole.ADMIN;

    if (!canBan) {
      throw new InsufficientPermissionsError();
    }

    const targetUser = await this._userRepo.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError("User not found");
    }

    const existingBan = await this._banRepo.findByServerAndUser(serverId, targetUserId);

    if (existingBan) {
      throw new BadRequestError("User is already banned from this server");
    }

    const targetMember = await this._memberRepo.findByServerAndUser(serverId, targetUserId);

    if (targetMember?.role === ServerMemberRole.OWNER) {
      throw new CannotRemoveOwnerError();
    }

    if (
      currentMember.role === ServerMemberRole.ADMIN &&
      targetMember &&
      targetMember.role !== ServerMemberRole.MEMBER
    ) {
      throw new InsufficientPermissionsError();
    }

    //ban a user from a server
    const ban = new ServerBan({
      serverId,
      userId: targetUserId,
      bannedBy: currentUserId,
      reason,
    });

    const createdBan = await this._banRepo.create(ban);

    if (targetMember) {
      await this._membershipCleanupService.removeMemberAndDecrementCount(serverId, targetUserId);
    }

    await this._auditLogRepo.create(
      new ServerAuditLog({
        serverId,
        actorId: currentUserId,
        action: "MEMBER_BANNED",
        targetId: targetUserId,
        metadata: {
          reason,
        },
      }),
    );

    return {
      id: createdBan.id,
      serverId: createdBan.serverId,
      userId: createdBan.userId,
      username: targetUser.username,
      avatar: targetUser.avatar,
      bannedBy: createdBan.bannedBy,
      reason: createdBan.reason,
      createdAt: createdBan.createdAt,
    };
  }
}
