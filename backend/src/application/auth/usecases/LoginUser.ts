import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/interfaces/IPasswordHasher";
import { ITokenService } from "../../../domain/auth/interfaces/ITokenService";
import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";
import { SecureTokenGenerator } from "../../../infrastructure/auth/services/SecureTokenGenerator";
import { InvalidCredentialsError } from "../../../domain/auth/errors/InvalidCredentialsError";
import { UserMapper } from "../mappers/UseMapper";
import { LoginUserRequest } from "../dtos/requests/LoginUserRequest";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";

export class LoginUser {
  constructor(
    private userRepo: IUserRepository,
    private hasher: IPasswordHasher,
    private tokenService: ITokenService,
    private refreshRepo: IRefreshTokenRepository,
    private tokenGenerator: SecureTokenGenerator,
  ) {}

  async execute(dto: LoginUserRequest, ip?: string, ua?: string): Promise<LoginUserResponse> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await this.hasher.compare(dto.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const accessToken = this.tokenService.generateAccessToken(user.id, user.globalRole);
    const refreshTokenRaw = this.tokenGenerator.generate();
    const refreshTokenHash = this.tokenGenerator.hash(refreshTokenRaw);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshRepo.save({
      userId: user.id,
      tokenHash: refreshTokenHash,
      expiresAt,
      ipAddress: ip,
      userAgent: ua,
    });

    return UserMapper.toLoginResponse(user, accessToken, refreshTokenRaw);
  }
}
