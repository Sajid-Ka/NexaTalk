import { IRefreshTokenRepository } from "../../../domain/features/auth/repositories/IRefreshTokenRepository";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { ITokenGenerator } from "../../../domain/features/auth/services/ITokenGenerator";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { InvalidRefreshTokenError } from "../../../domain/features/auth/errors/InvalidRefreshTokenError";
import { RefreshTokenResponse } from "../dtos/responses/RefreshTokenResponse";
import { IRefreshSessionUsecase } from "../interfaces/IRefreshSessionUsecase";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/core/common/services/ICacheService";
import { ITransactionManager } from "../../../domain/core/common/services/ITransactionManager";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { TimeUtil } from "../../../shared/utils/time/time.util";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";

@injectable()
export class RefreshSession implements IRefreshSessionUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenService) private readonly _tokenService: ITokenService,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.RefreshTokenTTLDays) private readonly _refreshTTLDays: number,
  ) {}

  async execute(refreshTokenRaw: string): Promise<RefreshTokenResponse> {
    const tokenHash = this._tokenGenerator.hash(refreshTokenRaw);
    const cacheKey = CACHE_KEYS.refresh(tokenHash);

    const storedSession = await this._refreshRepo.findByHash(tokenHash);
    if (!storedSession) {
      this._logger.warn("Refresh token not found", { tokenHash });
      throw new InvalidRefreshTokenError();
    }

    if (storedSession.revoked) {
      await this._refreshRepo.deleteAllByUser(storedSession.userId);
      this._logger.warn("Refresh token reuse detected", { userId: storedSession.userId });
      throw new InvalidRefreshTokenError();
    }

    if (storedSession.expiresAt.getTime() <= Date.now()) {
      await this._refreshRepo.revokeByHash(tokenHash);
      await this._cache.delete(cacheKey);
      throw new InvalidRefreshTokenError();
    }

    const user = await this._userRepo.findById(storedSession.userId);
    if (!user) {
      await this._refreshRepo.revokeByHash(tokenHash);
      await this._cache.delete(cacheKey);
      throw new InvalidRefreshTokenError();
    }

    if (user.accountStatus !== UserAccountStatus.ACTIVE) {
      await this._refreshRepo.revokeByHash(tokenHash);
      await this._cache.delete(cacheKey);
      this._logger.warn("Refresh attempt for inactive user", {
        userId: user.id,
        status: user.accountStatus,
      });
      throw new InvalidRefreshTokenError();
    }

    const newRefreshRaw = this._tokenGenerator.generate();
    const newRefreshHash = this._tokenGenerator.hash(newRefreshRaw);

    const newExpires = TimeUtil.addDays(new Date(), this._refreshTTLDays);
    const ttlSeconds = TimeUtil.daysToSeconds(this._refreshTTLDays);

    await this._transactionManager.run(async (session) => {
      await this._refreshRepo.revokeByHash(tokenHash, session);

      await this._refreshRepo.save(
        {
          userId: user.id,
          tokenHash: newRefreshHash,
          expiresAt: newExpires,
          ipAddress: storedSession.ipAddress,
          userAgent: storedSession.userAgent,
        },
        session,
      );
    });

    await this._cache.delete(cacheKey);
    await this._cache.set(CACHE_KEYS.refresh(newRefreshHash), { userId: user.id }, ttlSeconds);

    const accessToken = this._tokenService.generateAccessToken(
      user.id,
      user.globalRole,
      user.sessionVersion,
    );

    return {
      accessToken,
      refreshToken: newRefreshRaw,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        globalRole: user.globalRole,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
      requiresOnboarding: !user.hasCompletedOnboarding,
    };
  }
}
