import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/services/IPasswordHasher";
import { User } from "../../../domain/auth/entities/User";
import { ConflictError } from "../../../domain/auth/errors/ConflictError";
import { RegisterUserMapper } from "../mappers/RegisterUserMapper";
import { RegisterUserRequest } from "../dtos/requests/RegisterUserRequest";
import { RegisterUserResponse } from "../dtos/responses/RegisterUserResponse";
import { IRegisterUserUsecase } from "../interfaces/IRegisterUserUsecase";
import { SendVerificationEmail } from "./SendVerificationEmail";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

@injectable()
export class RegisterUser implements IRegisterUserUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(AUTH_TYPES.PasswordHasher) private _hasher: IPasswordHasher,
    @inject(AUTH_TYPES.SendVerificationEmail) private _sendVerificationEmail: SendVerificationEmail
  ) {}

  async execute(dto: RegisterUserRequest): Promise<RegisterUserResponse> {
    const exists = await this._userRepo.findByEmail(dto.email);
    if (exists) throw new ConflictError();

    const hashedPassword = await this._hasher.hash(dto.password);

    const newUser = new User({
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword,
      globalRole: "user",
      status: "offline",
      isProfilePublic: true,
      isBlocked: false,
    });

    const user = await this._userRepo.create(newUser);
    try {
      await this._sendVerificationEmail.execute(user.id);
    } catch (error) {
      console.error("Verification email failed : ", error);
    }

    return RegisterUserMapper.toRegisterResponse(user);
  }
}
