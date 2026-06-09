import { User } from "../../../domain/features/auth/entities/User";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IRefreshTokenRepository } from "../../../domain/features/auth/repositories/IRefreshTokenRepository";
import { ITokenGenerator } from "../../../domain/features/auth/services/ITokenGenerator";
import { ICacheService } from "../../../domain/core/common/services/ICacheService";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { TimeUtil } from "../../../shared/utils/time/time.util";
import { CACHE_KEYS } from "../../../shared/constants/cacheKeys";
import { UserPresenceStatus } from "../../../shared/constants/userPresenceStatus.const";
import { LoginUserMapper } from "../mappers/LoginUserMapper";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";

export interface IAuthSessionService {
  createSession(user: User, ip?: string, ua?: string): Promise<LoginUserResponse>;
}

@injectable()
export class AuthSessionService implements IAuthSessionService {
  constructor(
    @inject(AUTH_TYPES.TokenService) private readonly _tokenService: ITokenService,
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(COMMON_TYPES.CacheService) private readonly _cache: ICacheService,
    @inject(AUTH_TYPES.RefreshTokenTTLDays) private readonly _refreshTTLDays: number,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
  ) {}

  async createSession(user: User, ip?: string, ua?: string): Promise<LoginUserResponse> {
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

    const onlineUser = await this._userRepo.update(user.id, {
      status: UserPresenceStatus.ONLINE,
      lastSeenAt: null,
    });

    this._logger.info("Session created", { userId: user.id });

    return LoginUserMapper.toLoginResponse(onlineUser ?? user, accessToken, refreshTokenRaw);
  }
}
