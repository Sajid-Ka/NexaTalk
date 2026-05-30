import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/features/auth/services/IPasswordHasher";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IRefreshTokenRepository } from "../../../domain/features/auth/repositories/IRefreshTokenRepository";
import { InvalidCredentialsError } from "../../../domain/features/auth/errors/InvalidCredentialsError";
import { LoginUserMapper } from "../mappers/LoginUserMapper";
import { LoginUserRequest } from "../dtos/requests/LoginUserRequest";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";
import { ILoginUserUsecase } from "../interfaces/ILoginUserUsecase";
import { ITokenGenerator } from "../../../domain/features/auth/services/ITokenGenerator";
import { EmailNotVerifiedError } from "../../../domain/features/auth/errors/EmailNotVerifiedError";
import { UserBlockedError } from "../../../domain/features/auth/errors/UserBlockedError";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/core/common/services/ICacheService";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { TimeUtil } from "../../../shared/utils/time/time.util";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { AccountDeletedError } from "../../../domain/features/auth/errors/AccountDeletedError";

@injectable()
export class LoginUser implements ILoginUserUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private readonly _hasher: IPasswordHasher,
    @inject(AUTH_TYPES.TokenService) private readonly _tokenService: ITokenService,
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(AUTH_TYPES.RefreshTokenTTLDays) private readonly _refreshTTLDays: number,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(dto: LoginUserRequest, ip?: string, ua?: string): Promise<LoginUserResponse> {
    this._logger.info("Login attempt", { email: dto.email });

    const user = await this._userRepo.findByEmailIncludingDeleted(dto.email);
    if (!user) {
      this._logger.warn("Invalid credentials", { email: dto.email });
      throw new InvalidCredentialsError();
    }

    const valid = await this._hasher.compare(dto.password, user.passwordHash);
    if (!valid) {
      this._logger.warn("Invalid credentials", { email: dto.email });
      throw new InvalidCredentialsError();
    }

    if (user.deletedAt || user.accountStatus === UserAccountStatus.DELETED) {
      this._logger.warn("Login attempt for deleted user", {
        userId: user.id,
        status: user.accountStatus,
      });

      throw new AccountDeletedError();
    }

    if (!user.isEmailVerified) throw new EmailNotVerifiedError();

    if (user.accountStatus !== UserAccountStatus.ACTIVE) {
      this._logger.warn("Login attempt for inactive user", {
        userId: user.id,
        status: user.accountStatus,
      });
      throw new UserBlockedError(user.blockedReason);
    }

    const accessToken = this._tokenService.generateAccessToken(
      user.id,
      user.globalRole,
      user.sessionVersion,
    );
    const refreshTokenRaw = this._tokenGenerator.generate();
    const refreshTokenHash = this._tokenGenerator.hash(refreshTokenRaw);

    const expiresAt = TimeUtil.addDays(new Date(), this._refreshTTLDays);

    await this._refreshRepo.save({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
      ipAddress: ip,
      userAgent: ua,
    });

    await this._cache.set(
      CACHE_KEYS.refresh(refreshTokenHash),
      { userId: user.id },
      TimeUtil.daysToSeconds(this._refreshTTLDays),
    );

    this._logger.info("Login success", { userId: user.id });

    return LoginUserMapper.toLoginResponse(user, accessToken, refreshTokenRaw);
  }
}
