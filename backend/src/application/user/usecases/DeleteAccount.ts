import { inject, injectable } from "inversify";
import { IDeleteAccountUsecase } from "../interfaces/IDeleteAccountUsecase";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerMembershipCleanupService } from "../../servers/members/interfaces/IServerMembershipCleanupService";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";

@injectable()
export class DeleteAccount implements IDeleteAccountUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _serverMemberRepo: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerMembershipCleanupService)
    private readonly _membershipCleanupService: IServerMembershipCleanupService,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    // Check if user is the owner of any servers
    const ownedServers = await this._serverRepo.findByOwner(userId);
    if (ownedServers.length > 0) {
      throw new BadRequestError(
        "You must transfer ownership of your servers before deleting your account.",
      );
    }

    // Remove user from all servers and update server member counts silently (no audit logs)
    // We do this BEFORE deleting the account to avoid orphaned memberships if this loop fails
    const userMemberships = await this._serverMemberRepo.findByUser(userId);
    for (const membership of userMemberships) {
      await this._membershipCleanupService.removeMemberAndDecrementCount(
        membership.serverId,
        userId,
      );
    }

    // Soft delete: set deletedAt, accountStatus, and invalidate sessions
    await this._userRepo.update(userId, {
      deletedAt: new Date(),
      accountStatus: UserAccountStatus.DELETED,
      sessionVersion: user.sessionVersion + 1,
    });
  }
}
