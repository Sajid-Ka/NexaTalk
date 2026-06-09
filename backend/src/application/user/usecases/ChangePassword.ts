import { inject, injectable } from "inversify";
import { IChangePasswordUsecase } from "../interfaces/IChangePasswordUsecase";
import { ChangePasswordRequest } from "../dtos/requests/ChangePasswordRequest";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/features/auth/services/IPasswordHasher";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { ValidationError } from "../../../domain/core/errors/ValidationError";
import { AuthProviderNotEnabledError } from "../../../domain/features/auth/errors/AuthProviderNotEnabledError";
import { passwordValidator } from "../../../shared/baseValidators/authValidator";

@injectable()
export class ChangePassword implements IChangePasswordUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private readonly _hasher: IPasswordHasher,
  ) {}

  async execute(userId: string, request: ChangePasswordRequest): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    if (user.authProviders?.password === false) {
      throw new AuthProviderNotEnabledError("Password login is not enabled for this account.");
    }

    const isValid = await this._hasher.compare(request.currentPassword, user.passwordHash);
    if (!isValid) throw new BadRequestError("Incorrect current password");

    if (request.newPassword !== request.confirmNewPassword) {
      throw new BadRequestError("Passwords do not match");
    }

    const newPasswordValidation = passwordValidator.safeParse(request.newPassword);
    if (!newPasswordValidation.success) {
      throw new ValidationError(
        "Invalid request data",
        newPasswordValidation.error.issues.map((err) => ({
          path: "newPassword",
          message: err.message,
        })),
      );
    }

    const isSamePassword = await this._hasher.compare(request.newPassword, user.passwordHash);
    if (isSamePassword)
      throw new BadRequestError("New password must be different from your current password");

    const newPasswordHash = await this._hasher.hash(request.newPassword);

    // We increment session version to invalidate all active sessions
    await this._userRepo.update(userId, {
      passwordHash: newPasswordHash,
      sessionVersion: user.sessionVersion + 1,
    });
  }
}
