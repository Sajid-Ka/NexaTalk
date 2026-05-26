import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerBanRepository } from "../../../../domain/features/servers/repositories/IServerBanRepository";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { IUnbanServerMemberUsecase } from "../interfaces/IUnbanServerMemberUsecase";

@injectable()
export class UnbanServerMember implements IUnbanServerMemberUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository)
    private readonly _serverRepo: IServerRepository,

    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,

    @inject(SERVERS_TYPES.ServerBanRepository)
    private readonly _banRepo: IServerBanRepository,
  ) {}

  async execute(serverId: string, currentUserId: string, targetUserId: string): Promise<void> {
    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const currentMember = await this._memberRepo.findByServerAndUser(serverId, currentUserId);

    if (!currentMember) {
      throw new NotMemberError();
    }

    const canUnban =
      currentMember.role === ServerMemberRole.OWNER ||
      currentMember.role === ServerMemberRole.ADMIN;

    if (!canUnban) {
      throw new InsufficientPermissionsError();
    }

    //unban a user (member) in a server
    const deleted = await this._banRepo.deleteByServerAndUser(serverId, targetUserId);

    if (!deleted) {
      throw new NotFoundError("Ban not found");
    }
  }
}
