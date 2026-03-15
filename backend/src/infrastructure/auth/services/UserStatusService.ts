import { inject, injectable } from "inversify";
import { IUserStatusService } from "../../../domain/auth/services/IUserStatusService";
import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";

@injectable()
export class UserStatusService implements IUserStatusService {
  constructor(
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async validate(userId: string, sessionVersion: number): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (user.accountStatus !== UserAccountStatus.ACTIVE) {
      throw new UnauthorizedError("Account is blocked or deleted");
    }

    if (user.sessionVersion !== sessionVersion) {
      throw new UnauthorizedError("Session has expired or been revoked");
    }
  }
}
