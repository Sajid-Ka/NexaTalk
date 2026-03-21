import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IUserInterestRepository } from "../../../domain/features/interests/repositories/IUserInterestRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { UpdateProfileRequest } from "../dtos/requests/UpdateProfileRequest";
import { ProfileResponse } from "../dtos/responses/ProfileResponse";
import { ProfileMapper } from "../mappers/ProfileMapper";
import { IUpdateProfileUsecase } from "../interfaces/IUpdateProfileUsecase";

@injectable()
export class UpdateProfile implements IUpdateProfileUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: UpdateProfileRequest): Promise<ProfileResponse> {
    this._logger.info("Updating profile", { userId, request });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await this._userRepo.update(userId, {
      avatar: request.avatar ?? undefined,
      bio: request.bio,
      isProfilePublic: request.isProfilePublic,
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found after update");
    }

    const interests = await this._userInterestRepo.findByUser(userId);

    return ProfileMapper.toResponse(updatedUser, interests);
  }
}
