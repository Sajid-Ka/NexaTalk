import { IVerifyEmailUsecase } from "../interfaces/IVerifyEmailUsecase";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
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
export class VerifyEmail implements IVerifyEmailUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.EmailVerificationTokenRepository)
    private readonly _tokenRepo: IEmailVerificationTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(rawToken: string): Promise<void> {
    const tokenHash = this._tokenGenerator.hash(rawToken);

    const cacheKey = CACHE_KEYS.verifyEmail(tokenHash);

    const exists = await this._cache.exists(cacheKey);
    if (!exists) throw new InvalidResetTokenError();

    const token = await this._tokenRepo.findByHash(tokenHash);
    if (!token) throw new InvalidResetTokenError();

    if (token.used) {
      await this._cache.delete(cacheKey);
      throw new TokenAlreadyUsedError();
    }

    if (token.isExpired()) throw new TokenExpiredError();

    const user = await this._userRepo.findById(token.userId);
    if (!user) throw new NotFoundError("user not find");

    if (user.isEmailVerified) {
      await this._tokenRepo.markAsUsed(token.id!);
      return;
    }

    await this._transactionManager.run(async (session) => {
      await this._userRepo.update(user.id, { isEmailVerified: true }, session);

      await this._tokenRepo.markAsUsed(token.id!, session);

      await this._tokenRepo.deleteAllByUser(user.id, session);
    });

    await this._cache.delete(cacheKey);

    this._logger.info("Email verified", { userId: user.id });
  }
}
