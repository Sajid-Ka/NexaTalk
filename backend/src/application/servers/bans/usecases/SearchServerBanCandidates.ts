import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerBanRepository } from "../../../../domain/features/servers/repositories/IServerBanRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { BadRequestError } from "../../../../domain/core/errors/BadRequestError";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { ISearchServerBanCandidatesUsecase } from "../interfaces/ISearchServerBanCandidatesUsecase";
import { ServerBanCandidateResponse } from "../dtos/responses/ServerBanCandidateResponse";

@injectable()
export class SearchServerBanCandidates implements ISearchServerBanCandidatesUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository)
    private readonly _serverRepo: IServerRepository,

    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,

    @inject(SERVERS_TYPES.ServerBanRepository)
    private readonly _banRepo: IServerBanRepository,

    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
  ) {}

  async execute(
    serverId: string,
    currentUserId: string,
    query: string,
  ): Promise<ServerBanCandidateResponse[]> {
    const searchQuery = query.trim();

    if (searchQuery.length < 2) {
      throw new BadRequestError("Search query must be at least 2 characters");
    }

    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const currentMember = await this._memberRepo.findByServerAndUser(serverId, currentUserId);

    if (!currentMember) {
      throw new NotMemberError();
    }

    const isOwner = currentMember.role === ServerMemberRole.OWNER;
    const isAdmin = currentMember.role === ServerMemberRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new InsufficientPermissionsError();
    }

    //search the user for ban (fetch a user to ban him with searching his name or email)
    const users = await this._userRepo.search(searchQuery, 10);

    const candidates = await Promise.all(
      users.map(async (user) => {
        if (user.id === currentUserId) return null;
        if (user.id === server.ownerId) return null;

        const existingBan = await this._banRepo.findByServerAndUser(serverId, user.id);

        if (existingBan) return null;

        const member = await this._memberRepo.findByServerAndUser(serverId, user.id);

        if (isAdmin && member && member.role !== ServerMemberRole.MEMBER) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          serverRole: member?.role ?? null,
        };
      }),
    );

    return candidates.filter(Boolean) as ServerBanCandidateResponse[];
  }
}
