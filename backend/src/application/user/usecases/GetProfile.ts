import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IUserInterestRepository } from "../../../domain/features/interests/repositories/IUserInterestRepository";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";
import { ProfileResponse } from "../dtos/responses/ProfileResponse";
import { PublicProfileResponse } from "../dtos/responses/PublicProfileResponse";
import { ProfileMapper } from "../mappers/ProfileMapper";
import { IGetProfileUsecase } from "../interfaces/IGetProfileUsecase";

@injectable()
export class GetProfile implements IGetProfileUsecase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(
    targetUserId: string,
    requestingUserId?: string,
  ): Promise<ProfileResponse | PublicProfileResponse> {
    this._logger.info("Getting profile", { targetUserId, requestingUserId });

    const user = await this._userRepo.findById(targetUserId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const interests = await this._userInterestRepo.findByUser(targetUserId);

    const isOwnProfile = requestingUserId === targetUserId;

    if (!user.isProfilePublic && !isOwnProfile) {
      return ProfileMapper.toPublicResponse(user, interests);
    }

    return ProfileMapper.toResponse(user, interests);
  }
}
