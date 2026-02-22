import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/interfaces/IPasswordHasher";
import { User } from "../../../domain/auth/entities/User";
import { ConflictError } from "../../../domain/auth/errors/ConflictError";
import { UserMapper } from "../mappers/UseMapper";
import { RegisterUserRequest } from "../dtos/requests/RegisterUserRequest";
import { RegisterUserResponse } from "../dtos/responses/RegisterUserResponse";

export class RegisterUser {
  constructor(
    private userRepo: IUserRepository,
    private hasher: IPasswordHasher,
  ) {}

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
