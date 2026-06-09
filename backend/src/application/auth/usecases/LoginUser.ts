import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/features/auth/services/IPasswordHasher";
import { InvalidCredentialsError } from "../../../domain/features/auth/errors/InvalidCredentialsError";
import { LoginUserRequest } from "../dtos/requests/LoginUserRequest";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";
import { ILoginUserUsecase } from "../interfaces/ILoginUserUsecase";
import { EmailNotVerifiedError } from "../../../domain/features/auth/errors/EmailNotVerifiedError";
import { UserBlockedError } from "../../../domain/features/auth/errors/UserBlockedError";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { AccountDeletedError } from "../../../domain/features/auth/errors/AccountDeletedError";
import { IAuthSessionService } from "../services/AuthSessionService";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ILogger } from "../../../domain/core/common/services/ILogger";

@injectable()
export class LoginUser implements ILoginUserUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private readonly _hasher: IPasswordHasher,
    @inject(AUTH_TYPES.AuthSessionService) private readonly _sessionService: IAuthSessionService,
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

    return this._sessionService.createSession(user, ip, ua);
  }
}
