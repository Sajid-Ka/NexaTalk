import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { IPasswordHasher } from "../../../domain/auth/interfaces/IPasswordHasher";
import { RegisterUserRequest } from "../dtos/requests/RegisterUserRequest";
import { RegisterUserResponse } from "../dtos/responses/RegisterUserResponse";
import { ConflictError } from "../../../domain/auth/errors/ConflictError";
import { UserMapper } from "../mappers/UseMapper";

export class RegisterUser {
  constructor(
    private userRepo: IUserRepository,
    private hasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterUserRequest): Promise<RegisterUserResponse> {
    const exists = await this.userRepo.findByEmail(dto.email);

    if (exists) throw new ConflictError();

    const hashedPassword = await this.hasher.hash(dto.password);

    const user = await this.userRepo.create({
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword,
    });

    return UserMapper.toRegisterResponse(user);
  }
}
