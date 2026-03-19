import { inject, injectable } from "inversify";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IUserInterestRepository } from "../../../domain/features/interests/repositories/IUserInterestRepository";
import { IRemoveUserInterestsUseCase } from "../interfaces/IRemoveUserInterestsUsecase";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";

@injectable()
export class RemoveUserInterests implements IRemoveUserInterestsUseCase {
  constructor(
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, interestIds: string[]): Promise<void> {
    this._logger.info("Removing user interests", { userId, interestIds });

    if (!interestIds || interestIds.length === 0) {
      throw new BadRequestError("At least one interest ID is required");
    }

    // Verify user has these interests
    for (const interestId of interestIds) {
      const hasInterest = await this._userInterestRepo.hasInterest(userId, interestId);
      if (!hasInterest) {
        throw new NotFoundError(`Interest ${interestId} not found for user`);
      }
    }

    await this._userInterestRepo.removeInterests(userId, interestIds);

    this._logger.info("Successfully removed user interests", {
      userId,
      count: interestIds.length,
    });
  }
}
