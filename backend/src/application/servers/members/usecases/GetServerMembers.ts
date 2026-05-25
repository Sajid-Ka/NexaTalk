import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { IGetServerMembersUsecase } from "../interfaces/IGetServerMembersUsecase";
import { ServerMemberResponse } from "../dtos/responses/ServerMemberResponse";

@injectable()
export class GetServerMembers implements IGetServerMembersUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(serverId: string, currentUserId: string): Promise<ServerMemberResponse[]> {
    this._logger.info("Fetching server members", {
      serverId,
      currentUserId,
    });

    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const currentMember = await this._memberRepo.findByServerAndUser(serverId, currentUserId);

    if (!currentMember) {
      throw new NotMemberError();
    }

    const members = await this._memberRepo.findByServer(serverId);

    const memberResponses = await Promise.all(
      members.map(async (member) => {
        const user = await this._userRepo.findById(member.userId);

        if (!user) {
          return null;
        }

        return {
          id: member.id,
          userId: member.userId,
          username: user.username,
          avatar: user.avatar,
          status: user.status,
          role: member.role,
          joinedAt: member.joinedAt,
        };
      }),
    );

    return memberResponses.filter(Boolean) as ServerMemberResponse[];
  }
}
