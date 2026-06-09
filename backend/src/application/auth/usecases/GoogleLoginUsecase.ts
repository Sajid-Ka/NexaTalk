import { IGoogleLoginUsecase, GoogleLoginRequest } from "../interfaces/IGoogleLoginUsecase";
import { LoginUserResponse } from "../dtos/responses/LoginUserResponse";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IGoogleAuthService } from "../../../domain/features/auth/services/IGoogleAuthService";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";
import { UnauthorizedError } from "../../../domain/core/errors/UnauthorizedError";
import { UserBlockedError } from "../../../domain/features/auth/errors/UserBlockedError";
import { AccountDeletedError } from "../../../domain/features/auth/errors/AccountDeletedError";
import { User } from "../../../domain/features/auth/entities/User";
import { randomBytes } from "crypto";
import { IAuthSessionService } from "../services/AuthSessionService";

@injectable()
export class GoogleLoginUsecase implements IGoogleLoginUsecase {
  constructor(
    @inject(AUTH_TYPES.GoogleAuthService) private readonly _googleAuthService: IGoogleAuthService,
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.AuthSessionService) private readonly _sessionService: IAuthSessionService,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(dto: GoogleLoginRequest, ip?: string, ua?: string): Promise<LoginUserResponse> {
    this._logger.info("Google login attempt");

    // 1. Verify Google ID token
    const profile = await this._googleAuthService.verifyIdToken(dto.idToken);

    if (!profile.emailVerified) {
      this._logger.warn("Google login failed: email not verified", { email: profile.email });
      throw new UnauthorizedError(
        "Your Google email is not verified. Please verify your email with Google first.",
      );
    }

    // 2. Primary Lookup: by googleId
    let user = await this._userRepo.findByGoogleId(profile.googleId);

    if (user) {
      this._checkUserStatus(user);
    } else {
      // 3. Secondary Lookup: by email
      user = await this._userRepo.findByEmailIncludingDeleted(profile.email);

      if (user) {
        this._checkUserStatus(user);

        // Link account
        user = await this._userRepo.update(user.id, {
          googleId: profile.googleId,
          authProviders: {
            password: user.authProviders?.password ?? true,
            google: true,
          },
          isEmailVerified: true,
        });

        if (!user) {
          throw new Error("Failed to link Google account");
        }
      } else {
        // 4. Create new account
        const username = await this._generateUniqueUsername(profile.email);

        const newUser = new User({
          email: profile.email,
          username,
          passwordHash: "",
          avatar: profile.picture,
          isEmailVerified: true,
          authProviders: {
            password: false,
            google: true,
          },
          googleId: profile.googleId,
        });

        user = await this._userRepo.create(newUser);
      }
    }

    // 5. Create Session (reusing logic from LoginUser)
    return this._sessionService.createSession(user, ip, ua);
  }

  private _checkUserStatus(user: User): void {
    if (user.deletedAt || user.accountStatus === UserAccountStatus.DELETED) {
      this._logger.warn("Google login attempt for deleted user", {
        userId: user.id,
        status: user.accountStatus,
      });
      throw new AccountDeletedError();
    }

    if (user.accountStatus !== UserAccountStatus.ACTIVE) {
      this._logger.warn("Google login attempt for inactive user", {
        userId: user.id,
        status: user.accountStatus,
      });
      throw new UserBlockedError(user.blockedReason);
    }
  }

  private async _generateUniqueUsername(email: string): Promise<string> {
    const localPart = email.split("@")[0].toLowerCase();
    let baseUsername = localPart.replace(/[^a-z0-9]/g, "_").replace(/_{2,}/g, "_");

    if (baseUsername.length < 3) {
      baseUsername = baseUsername.padEnd(3, "0");
    }

    // Check if base is available
    const existing = await this._userRepo.findByUsernameIncludingDeleted(baseUsername);
    if (!existing) {
      return baseUsername;
    }

    // Suffix on collision
    let isUnique = false;
    let finalUsername = baseUsername;

    while (!isUnique) {
      const suffix = randomBytes(2).toString("hex"); // 4 char alphanumeric
      finalUsername = `${baseUsername}_${suffix}`;
      const check = await this._userRepo.findByUsernameIncludingDeleted(finalUsername);
      if (!check) {
        isUnique = true;
      }
    }

    return finalUsername;
  }
}
