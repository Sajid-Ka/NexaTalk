import { inject, injectable } from "inversify";
import { IRequestEmailChangeUsecase } from "../interfaces/IRequestEmailChangeUsecase";
import { RequestEmailChangeDto } from "../dtos/requests/RequestEmailChange";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/features/auth/services/IPasswordHasher";
import { IEmailVerificationTokenRepository } from "../../../domain/features/auth/repositories/IEmailVerificationTokenRepository";
import { ITokenGenerator } from "../../../domain/features/auth/services/ITokenGenerator";
import { IEmailService } from "../../../domain/features/auth/services/IEmailService";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ICacheService } from "../../../domain/core/common/services/ICacheService";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { ConflictError } from "../../../domain/features/auth/errors/ConflictError";
import { AuthProviderNotEnabledError } from "../../../domain/features/auth/errors/AuthProviderNotEnabledError";
import { EmailVerificationToken } from "../../../domain/features/auth/entities/EmailVerificationToken";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";

@injectable()
export class RequestEmailChange implements IRequestEmailChangeUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private readonly _passwordHasher: IPasswordHasher,
    @inject(AUTH_TYPES.EmailVerificationTokenRepository)
    private readonly _tokenRepo: IEmailVerificationTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(AUTH_TYPES.EmailService) private readonly _emailService: IEmailService,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.ClientOrigin) private readonly _clientOrigin: string,
  ) {}

  async execute(userId: string, dto: RequestEmailChangeDto): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    if (user.authProviders?.password === false) {
      throw new AuthProviderNotEnabledError("Email changes are not available for Google accounts.");
    }

    const isPasswordValid = await this._passwordHasher.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect.");
    }

    const newEmail = dto.newEmail.trim().toLowerCase();

    if (user.email === newEmail) {
      throw new BadRequestError("New email must be different from your current email.");
    }

    const existingUser = await this._userRepo.findByEmailIncludingDeleted(newEmail);
    if (existingUser) {
      throw new ConflictError("This email is already in use.");
    }

    // Delete existing tokens for the user
    await this._tokenRepo.deleteAllByUser(userId);

    // Generate token
    const rawToken = this._tokenGenerator.generate();
    const tokenHash = this._tokenGenerator.hash(rawToken);

    // Set expiration to 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const emailChangeToken = new EmailVerificationToken({
      userId: user.id,
      newEmail: newEmail,
      tokenHash,
      expiresAt,
    });

    await this._tokenRepo.save(emailChangeToken);

    // Save hash in cache for fast lookup (matching VerifyEmail logic)
    const cacheKey = CACHE_KEYS.verifyEmail(tokenHash);
    await this._cache.set(cacheKey, user.id, 15 * 60);

    // Send the email with the secure verification link
    const verificationLink = `${this._clientOrigin}/verify-email?token=${rawToken}`;

    await this._emailService.sendEmailChangeVerification(newEmail, verificationLink);

    this._logger.info("Email change verification sent", { userId: user.id });
  }
}
