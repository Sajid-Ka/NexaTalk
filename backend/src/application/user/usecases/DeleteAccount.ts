import { inject, injectable } from "inversify";
import { IDeleteAccountUsecase } from "../interfaces/IDeleteAccountUsecase";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";

@injectable()
export class DeleteAccount implements IDeleteAccountUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
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

    // Soft delete: set deletedAt, accountStatus, and invalidate sessions
    await this._userRepo.update(userId, {
      deletedAt: new Date(),
      accountStatus: UserAccountStatus.DELETED,
      sessionVersion: user.sessionVersion + 1,
    });
  }
}
