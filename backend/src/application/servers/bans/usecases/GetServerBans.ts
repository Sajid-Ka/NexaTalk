import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerBanRepository } from "../../../../domain/features/servers/repositories/IServerBanRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { IGetServerBansUsecase } from "../interfaces/IGetServerBansUsecase";
import { ServerBanResponse } from "../dtos/responses/ServerBanResponse";

@injectable()
export class GetServerBans implements IGetServerBansUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerBanRepository) private readonly _banRepo: IServerBanRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
  ) {}

  async execute(serverId: string, currentUserId: string): Promise<ServerBanResponse[]> {
    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const currentMember = await this._memberRepo.findByServerAndUser(serverId, currentUserId);

    if (!currentMember) {
      throw new NotMemberError();
    }

    const canManageBans =
      currentMember.role === ServerMemberRole.OWNER ||
      currentMember.role === ServerMemberRole.ADMIN;

    if (!canManageBans) {
      throw new InsufficientPermissionsError();
    }

    const bans = await this._banRepo.findByServer(serverId);

    //Fetch All banned users of a server
    const responses = await Promise.all(
      bans.map(async (ban) => {
        const user = await this._userRepo.findById(ban.userId);

        return {
          id: ban.id,
          serverId: ban.serverId,
          userId: ban.userId,
          username: user?.username ?? "Unknown User",
          avatar: user?.avatar,
          bannedBy: ban.bannedBy,
          reason: ban.reason,
          createdAt: ban.createdAt,
        };
      }),
    );

    return responses;
  }
}
