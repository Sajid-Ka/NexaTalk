import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ISendVerificationEmailUsecase } from "../interfaces/ISendVerificationEmailUsecase";
import { IRequestVerificationEmailUsecase } from "../interfaces/IRequestVerificationEmailUsecase";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class RequestVerificationEmail implements IRequestVerificationEmailUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.SendVerificationEmail)
    private readonly _sendVerificationEmail: ISendVerificationEmailUsecase,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this._userRepo.findByEmail(email);

    if (!user) {
      this._logger.warn("Verification email requested for unknown email", { email });
      return;
    }

    await this._sendVerificationEmail.execute(user.id);
  }
}
