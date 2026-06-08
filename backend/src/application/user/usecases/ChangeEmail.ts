import { inject, injectable } from "inversify";
import { IChangeEmailUsecase } from "../interfaces/IChangeEmailUsecase";
import { ChangeEmailRequest } from "../dtos/requests/ChangeEmailRequest";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/features/auth/services/IPasswordHasher";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";

@injectable()
export class ChangeEmail implements IChangeEmailUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private readonly _hasher: IPasswordHasher,
  ) {}

  async execute(userId: string, request: ChangeEmailRequest): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const isValid = await this._hasher.compare(request.passwordConfirmation, user.passwordHash);
    if (!isValid) throw new BadRequestError("Incorrect password");

    const existingUser = await this._userRepo.findByEmailIncludingDeleted(request.newEmail);
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestError("Email is already in use");
    }

    await this._userRepo.update(userId, { email: request.newEmail });
  }
}
