import { IUserRepository } from "../../../domain/auth/repositories/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/services/IPasswordHasher";
import { User } from "../../../domain/auth/entities/User";
import { ConflictError } from "../../../domain/auth/errors/ConflictError";
import { UserMapper } from "../mappers/UserMapper";
import { RegisterUserRequest } from "../dtos/requests/RegisterUserRequest";
import { RegisterUserResponse } from "../dtos/responses/RegisterUserResponse";
import { IRegisterUserUsecase } from "../interfaces/IRegisterUserUsecase";

export class RegisterUser implements IRegisterUserUsecase {
  constructor(
    private userRepo: IUserRepository,
    private hasher: IPasswordHasher,
  ) { }

  async execute(dto: RegisterUserRequest): Promise<RegisterUserResponse> {
    const exists = await this.userRepo.findByEmail(dto.email);
    if (exists) throw new ConflictError();

    const hashedPassword = await this.hasher.hash(dto.password);

    const newUser = new User({
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword,
      globalRole: "user",
      status: "offline",
      isProfilePublic: true,
      isBlocked: false,
    });

    const user = await this.userRepo.create(newUser);
    return UserMapper.toRegisterResponse(user);
  }
}
