import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IEmailVerificationTokenRepository } from "../../../domain/auth/repositories/IEmailVerificationTokenRepository";
import { IEmailService } from "../../../domain/auth/services/IEmailService";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { EmailVerificationToken } from "../../../domain/auth/entities/EmailVerificationToken";
import { ISendVerificationEmailUsecase } from "../interfaces/ISendVerificationEmailUsecase";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/common/services/ICacheService";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { TimeUtil } from "../../../shared/utils/time/time.util";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";
import { ILogger } from "../../../domain/common/services/ILogger";

@injectable()
export class SendVerificationEmail implements ISendVerificationEmailUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.EmailVerificationTokenRepository)
    private readonly _tokenRepo: IEmailVerificationTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(AUTH_TYPES.EmailService) private readonly _emailService: IEmailService,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(AUTH_TYPES.AppBaseUrl) private readonly _appBaseUrl: string,
    @inject(AUTH_TYPES.VerifyEmailTTLMinutes) private readonly _verifyTTLMinutes: number,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) return;

    if (user.isEmailVerified) return;

    await this._tokenRepo.deleteAllByUser(user.id);

    const rawToken = this._tokenGenerator.generate();
    const tokenHash = this._tokenGenerator.hash(rawToken);

    const expiresAt = TimeUtil.addMinutes(new Date(), this._verifyTTLMinutes);

    const ttlSeconds = TimeUtil.minutesToSeconds(this._verifyTTLMinutes);

    const token = new EmailVerificationToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    await this._tokenRepo.save(token);

    const cacheKey = CACHE_KEYS.verifyEmail(tokenHash);

    await this._cache.set(cacheKey, { userId: user.id }, ttlSeconds);

    const verificationLink = `${this._appBaseUrl}/verify-email?token=${rawToken}`;

    await this._emailService.sendVerificationEmail(user.email, verificationLink);

    this._logger.info("Verification email sent", { userId });
  }
}
