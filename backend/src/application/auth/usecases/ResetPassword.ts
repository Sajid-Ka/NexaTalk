import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/services/IPasswordHasher";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { IResetPasswordTokenRepository } from "../../../domain/auth/repositories/IResetPasswordTokenRepository";
import { IResetPasswordUsecase } from "../interfaces/IResetPasswordUsecase";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/common/services/ICacheService";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { InvalidResetTokenError } from "../../../domain/auth/errors/InvalidResetTokenError";
import { TokenAlreadyUsedError } from "../../../domain/auth/errors/TokenAlreadyUsedError";
import { TokenExpiredError } from "../../../domain/auth/errors/TokenExpiredError";
import { ITransactionManager } from "../../../domain/common/services/ITransactionManager";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";
import { ILogger } from "../../../domain/common/services/ILogger";
import { NotFoundError } from "../../../domain/errors/NotFoundError";

@injectable()
export class ResetPassword implements IResetPasswordUsecase {
  constructor(
    @inject(AUTH_TYPES.ResetPasswordTokenRepository)
    private readonly _resetRepo: IResetPasswordTokenRepository,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(AUTH_TYPES.PasswordHasher) private readonly _hasher: IPasswordHasher,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(token: string, newPassword: string) {
    const tokenHash = this._tokenGenerator.hash(token);
    const cacheKey = CACHE_KEYS.resetPassword(tokenHash);

    const exists = await this._cache.exists(cacheKey);
    if (!exists) throw new InvalidResetTokenError();

    const storedToken = await this._resetRepo.findByTokenHash(tokenHash);
    if (!storedToken) throw new InvalidResetTokenError();

    if (storedToken.used) {
      await this._cache.delete(cacheKey);
      throw new TokenAlreadyUsedError();
    }
    if (storedToken.isExpired()) throw new TokenExpiredError();

    const user = await this._userRepo.findById(storedToken.userId);
    if (!user) throw new NotFoundError("User not found");

    const hashedPassword = await this._hasher.hash(newPassword);

    await this._transactionManager.run(async (session) => {
      await this._userRepo.update(user.id, { passwordHash: hashedPassword }, session);

      await this._resetRepo.markAsUsed(storedToken.id!, session);

      await this._resetRepo.deleteByUserId(user.id, session);
    });

    await this._cache.delete(cacheKey);

    this._logger.info("Password reset", { userId: user.id });
  }
}
