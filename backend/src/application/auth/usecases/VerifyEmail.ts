import { IVerifyEmailUsecase } from "../interfaces/IVerifyEmailUsecase";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/features/auth/repositories/IEmailVerificationTokenRepository";
import { IRefreshTokenRepository } from "../../../domain/features/auth/repositories/IRefreshTokenRepository";
import { ITokenGenerator } from "../../../domain/features/auth/services/ITokenGenerator";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/core/common/services/ICacheService";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { InvalidResetTokenError } from "../../../domain/features/auth/errors/InvalidResetTokenError";
import { TokenAlreadyUsedError } from "../../../domain/features/auth/errors/TokenAlreadyUsedError";
import { ConflictError } from "../../../domain/features/auth/errors/ConflictError";
import { TokenExpiredError } from "../../../domain/features/auth/errors/TokenExpiredError";
import { ITransactionManager } from "../../../domain/core/common/services/ITransactionManager";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";

@injectable()
export class VerifyEmail implements IVerifyEmailUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.EmailVerificationTokenRepository)
    private readonly _tokenRepo: IEmailVerificationTokenRepository,
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(rawToken: string): Promise<{ message: string }> {
    const tokenHash = this._tokenGenerator.hash(rawToken);
    const cacheKey = CACHE_KEYS.verifyEmail(tokenHash);

    const token = await this._tokenRepo.findByHash(tokenHash);
    if (!token) throw new InvalidResetTokenError();

    if (token.used) {
      await this._cache.delete(cacheKey);
      throw new TokenAlreadyUsedError();
    }

    if (token.isExpired()) throw new TokenExpiredError();

    const user = await this._userRepo.findById(token.userId);
    if (!user) throw new NotFoundError("User not found");

    const newEmail = token.newEmail;
    if (newEmail) {
      // Re-check availability in case it was taken while pending
      const existingUser = await this._userRepo.findByEmailIncludingDeleted(newEmail);
      if (existingUser && existingUser.id !== user.id) {
        throw new ConflictError("This email is already in use.");
      }

      await this._transactionManager.run(async (session) => {
        await this._userRepo.update(
          user.id,
          {
            email: newEmail,
            isEmailVerified: true,
            sessionVersion: user.sessionVersion + 1,
          },
          session,
        );

        if (token.id) {
          await this._tokenRepo.markAsUsed(token.id, session);
        }
        await this._tokenRepo.deleteAllByUser(user.id, session);
      });

      // Invalidate all active sessions by deleting refresh tokens.
      // Combined with the sessionVersion increment above, this forces a complete logout.
      await this._refreshRepo.deleteAllByUser(user.id);

      await this._cache.delete(cacheKey);
      this._logger.info("Email changed successfully and sessions invalidated", {
        userId: user.id,
        newEmail,
      });

      return { message: "Email updated successfully. For security reasons, please sign in again." };
    }

    if (user.isEmailVerified) {
      if (token.id) await this._tokenRepo.markAsUsed(token.id);
      return { message: "Email successfully verified." }; // Default verify message
    }

    await this._transactionManager.run(async (session) => {
      await this._userRepo.update(user.id, { isEmailVerified: true }, session);

      if (token.id) await this._tokenRepo.markAsUsed(token.id, session);

      await this._tokenRepo.deleteAllByUser(user.id, session);
    });

    await this._cache.delete(cacheKey);

    this._logger.info("Email verified", { userId: user.id });

    return { message: "Email successfully verified." };
  }
}
