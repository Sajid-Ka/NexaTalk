import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/services/IPasswordHasher";
import { ITokenService } from "../../../domain/auth/services/ITokenService";
import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { InvalidCredentialsError } from "../../../domain/auth/errors/InvalidCredentialsError";
import { UserMapper } from "../mappers/UserMapper";
import { LoginUserRequest } from "../dtos/requests/LoginUserRequest";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";
import { ILoginUserUsecase } from "../interfaces/ILoginUserUsecase";
import { ITokenGenerator } from "../../../domain/auth/services/ITokenGenerator";

export class LoginUser implements ILoginUserUsecase {
  constructor(
    private userRepo: IUserRepository,
    private hasher: IPasswordHasher,
    private tokenService: ITokenService,
    private refreshRepo: IRefreshTokenRepository,
    private tokenGenerator: ITokenGenerator,
  ) { }

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
