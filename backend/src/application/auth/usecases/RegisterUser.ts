import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/features/auth/services/IPasswordHasher";
import { User } from "../../../domain/features/auth/entities/User";
import { ConflictError } from "../../../domain/features/auth/errors/ConflictError";
import { RegisterUserMapper } from "../mappers/RegisterUserMapper";
import { RegisterUserRequest } from "../dtos/requests/RegisterUserRequest";
import { RegisterUserResponse } from "../dtos/responses/RegisterUserResponse";
import { IRegisterUserUsecase } from "../interfaces/IRegisterUserUsecase";
import { ISendVerificationEmailUsecase } from "../interfaces/ISendVerificationEmailUsecase";
import { ITransactionManager } from "../../../domain/core/common/services/ITransactionManager";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { GlobalRole } from "../../../shared/constants/userRole.const";
import { UserPresenceStatus } from "../../../shared/constants/userPresenceStatus.const";

@injectable()
export class RegisterUser implements IRegisterUserUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private readonly _hasher: IPasswordHasher,
    @inject(AUTH_TYPES.SendVerificationEmail)
    private readonly _sendVerificationEmail: ISendVerificationEmailUsecase,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(dto: RegisterUserRequest): Promise<RegisterUserResponse> {
    const emailExists = await this._userRepo.findByEmail(dto.email);
    if (emailExists) {
      throw new ConflictError("EMAIL_ALREADY_REGISTERED", "Email already registered");
    }

    const usernameExists = await this._userRepo.findByUsername(dto.username);
    if (usernameExists) {
      throw new ConflictError("USERNAME_ALREADY_TAKEN", "Username already taken");
    }

    const hashedPassword = await this._hasher.hash(dto.password);

    const newUser = new User({
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword,
      globalRole: GlobalRole.USER,
      status: UserPresenceStatus.OFFLINE,
      isProfilePublic: true,
      hasCompletedOnboarding: false,
    });

    const user = await this._transactionManager.run(async (session) => {
      const createUser = await this._userRepo.create(newUser, session);
      return createUser;
    });

    try {
      await this._sendVerificationEmail.execute(user.id);
    } catch (error) {
      this._logger.error("Verification email failed", error);
    }

    return RegisterUserMapper.toRegisterResponse(user);
  }
}
