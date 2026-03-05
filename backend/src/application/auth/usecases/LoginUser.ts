import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/services/IPasswordHasher";
import { ITokenService } from "../../../domain/auth/services/ITokenService";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { InvalidCredentialsError } from "../../../domain/auth/errors/InvalidCredentialsError";
import { LoginUserMapper } from "../mappers/LoginUserMapper";
import { LoginUserRequest } from "../dtos/requests/LoginUserRequest";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";
import { ILoginUserUsecase } from "../interfaces/ILoginUserUsecase";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";
import { EmailNotVerifiedError } from "../../../domain/auth/errors/EmailNotVerifiedError";
import { injectable,inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/common/service/ICacheService";

@injectable()
export class LoginUser implements ILoginUserUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private _hasher: IPasswordHasher,
    @inject(AUTH_TYPES.TokenService) private _tokenService: ITokenService,
    @inject(AUTH_TYPES.RefreshTokenRepository) private _refreshRepo: IRefreshTokenRepository,
    @inject(AUTH_TYPES.TokenGenerator) private _tokenGenerator: ITokenGenerator,
    @inject(AUTH_TYPES.CacheService) private _cache : ICacheService
  ) { }

  async execute(dto: LoginUserRequest, ip?: string, ua?: string): Promise<LoginUserResponse> {
    const user = await this._userRepo.findByEmail(dto.email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await this._hasher.compare(dto.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    if (!user.isEmailVerified) throw new EmailNotVerifiedError();

    const accessToken = this._tokenService.generateAccessToken(user.id, user.globalRole);
    const refreshTokenRaw = this._tokenGenerator.generate();
    const refreshTokenHash = this._tokenGenerator.hash(refreshTokenRaw);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this._refreshRepo.save({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
      ipAddress: ip,
      userAgent: ua,
    });

    await this._cache.set(
      `refresh:${refreshTokenHash}`,
      {userId : user.id},
      60 * 60 * 24 * 7
    );

    return LoginUserMapper.toLoginResponse(user, accessToken, refreshTokenRaw);
  }
}
