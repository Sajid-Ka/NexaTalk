import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IEmailService } from "../../../domain/features/auth/services/IEmailService";
import { ITokenGenerator } from "../../../domain/features/auth/services/ITokenGenerator";
import { IResetPasswordTokenRepository } from "../../../domain/features/auth/repositories/IResetPasswordTokenRepository";
import { ResetPasswordToken } from "../../../domain/features/auth/entities/ResetPasswordToken";
import { IRequestPasswordResetUsecase } from "../interfaces/IRequestPasswordResetUsecase";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/core/common/services/ICacheService";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { TimeUtil } from "../../../shared/utils/time/time.util";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { AuthProviderNotEnabledError } from "../../../domain/features/auth/errors/AuthProviderNotEnabledError";

@injectable()
export class RequestPasswordReset implements IRequestPasswordResetUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(AUTH_TYPES.ResetPasswordTokenRepository)
    private readonly _resetRepo: IResetPasswordTokenRepository,
    @inject(AUTH_TYPES.EmailService) private readonly _emailService: IEmailService,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(AUTH_TYPES.ClientOrigin) private readonly _frontendUrl: string,
    @inject(AUTH_TYPES.ResetPasswordTTLMinutes) private readonly _resetTTLMinutes: number,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(email: string) {
    this._logger.info("Password reset requested");

    const user = await this._userRepo.findByEmail(email);

    if (!user) return;

    if (user.authProviders?.password === false) {
      throw new AuthProviderNotEnabledError("Password login is not enabled for this account.");
    }

    const rawToken = this._tokenGenerator.generate();
    const tokenHash = this._tokenGenerator.hash(rawToken);

    const expiresAt = TimeUtil.addMinutes(new Date(), this._resetTTLMinutes);

    const ttlSeconds = TimeUtil.minutesToSeconds(this._resetTTLMinutes);

    await this._resetRepo.save(
      new ResetPasswordToken({
        userId: user.id,
        tokenHash,
        expiresAt,
      }),
    );

    const cacheKey = CACHE_KEYS.resetPassword(tokenHash);

    await this._cache.set(cacheKey, { userId: user.id }, ttlSeconds);

    const resetLink = `${this._frontendUrl}/reset-password?token=${rawToken}`;

    await this._emailService.sendPasswordResetEmail(user.email, resetLink);
  }
}
