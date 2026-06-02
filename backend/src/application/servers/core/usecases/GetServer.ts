import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IGetServerUsecase } from "../interfaces/IGetServerUsecase";
import { ServerMemberResponse, ServerResponse } from "../dtos/responses/ServerResponse";
import { ServerMapper } from "../mappers/ServerMapper";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";

@injectable()
export class GetServer implements IGetServerUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(serverId: string, userId?: string): Promise<ServerResponse> {
    this._logger.info("Getting server", { serverId, userId });

    const server = await this._serverRepo.findById(serverId);
    if (!server) {
      throw new ServerNotFoundError();
    }

    const members = await this._memberRepo.findByServer(serverId);

    const memberResponses = await Promise.all(
      members.map(async (member) => {
        const user = await this._userRepo.findById(member.userId);
        if (!user) return null;

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

    // Check if private server requires membership
    if (server.isPrivate() && userId) {
      const isMember = await this._memberRepo.isMember(serverId, userId);
      if (!isMember) {
        throw new NotMemberError();
      }
    }

    return ServerMapper.toResponse(
      server,
      memberResponses.filter(Boolean) as ServerMemberResponse[],
    );
  }
}
