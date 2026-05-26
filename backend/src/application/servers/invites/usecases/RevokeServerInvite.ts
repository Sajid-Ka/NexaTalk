import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerInviteRepository } from "../../../../domain/features/servers/repositories/IServerInviteRepository";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { IRevokeServerInviteUsecase } from "../interfaces/IRevokeServerInviteUsecase";

@injectable()
export class RevokeServerInvite implements IRevokeServerInviteUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerInviteRepository)
    private readonly _inviteRepo: IServerInviteRepository,
  ) {}

  async execute(serverId: string, userId: string, inviteId: string): Promise<void> {
    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const member = await this._memberRepo.findByServerAndUser(serverId, userId);

    if (!member) {
      throw new NotMemberError();
    }

    const canManageInvites =
      member.role === ServerMemberRole.OWNER || member.role === ServerMemberRole.ADMIN;

    if (!canManageInvites) {
      throw new InsufficientPermissionsError();
    }

    const invite = await this._inviteRepo.findById(inviteId);

    if (!invite || invite.serverId !== serverId) {
      throw new NotFoundError("Invite not found");
    }

    await this._inviteRepo.delete(inviteId);
  }
}
