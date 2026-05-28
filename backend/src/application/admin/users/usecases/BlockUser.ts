import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../../main/di/modules/admin/admin.types";
import { IAdminUserRepository } from "../../../../domain/features/admin/repositories/IAdminUserRepository";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { IBlockUserUsecase } from "../interfaces/IBlockUserUsecase";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { UserAccountStatus } from "../../../../shared/constants/authStatus.const";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { ITokenService } from "../../../../domain/features/auth/services/ITokenService";

@injectable()
export class BlockUser implements IBlockUserUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminUserRepository) private readonly _repo: IAdminUserRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.TokenService) private readonly _tokenService: ITokenService,
  ) {}

  async execute(userId: string, adminId: string): Promise<void> {
    this._logger.info("Block user attempt", { userId });

    if (userId === adminId) {
      this._logger.warn("Admin attempted to block themselves", { adminId });
      throw new ForbiddenError("You cannot block your own account");
    }

    const user = await this._repo.findById(userId);

    if (!user) {
      this._logger.warn("Block user failed - user not found", { userId });
      throw new NotFoundError("User not found");
    }

    await this._repo.update(userId, {
      accountStatus: UserAccountStatus.BLOCKED,
      sessionVersion: (user.sessionVersion || 1) + 1,
    });

    await this._tokenService.revokeUserTokens?.(userId);

    this._logger.warn("ADMIN_ACTION_BLOCK_USER", { targetUserId: userId });
  }
}
