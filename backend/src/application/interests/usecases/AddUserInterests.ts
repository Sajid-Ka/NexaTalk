import { inject, injectable } from "inversify";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IUserInterestRepository } from "../../../domain/features/interests/repositories/IUserInterestRepository";
import { IInterestRepository } from "../../../domain/features/interests/repositories/IInterestRepository";
import { IAddUserInterestsUseCase } from "../interfaces/IAddUserInterestsUsecase";
import { AddUserInterestsRequest } from "../dtos/requests/AddUserInterestsRequest";
import { InterestResponse } from "../dtos/responses/InterestResponse";
import { InterestApplicationMapper } from "../mappers/InterestMapper";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { MaxInterestsReachedError } from "../../../domain/features/interests/errors/MaxInterestsReachedError";
import { BadRequestError } from "../../../domain/core/errors/BadRequestError";

@injectable()
export class AddUserInterests implements IAddUserInterestsUseCase {
  constructor(
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(INTERESTS_TYPES.InterestRepository) private readonly _interestRepo: IInterestRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: AddUserInterestsRequest): Promise<InterestResponse[]> {
    this._logger.info("Adding user interests", { userId, interests: request.interests });

    if (!request.interests || request.interests.length === 0) {
      throw new BadRequestError("At least one interest is required");
    }

    if (request.interests.length > 20) {
      throw new BadRequestError("Cannot add more than 20 interests at once");
    }

    // Validate each interest name
    for (const name of request.interests) {
      if (name.trim().length < 2) {
        throw new BadRequestError(`Interest "${name}" must be at least 2 characters`);
      }
      if (name.trim().length > 50) {
        throw new BadRequestError(`Interest "${name}" must be at most 50 characters`);
      }
    }

    // Find or create each interest
    const interestIds: string[] = [];
    for (const name of request.interests) {
      const interest = await this._interestRepo.findOrCreate(name.trim());
      interestIds.push(interest.id);
    }

    try {
      // Add interests to user
      await this._userInterestRepo.addInterests(userId, interestIds);
    } catch (error) {
      if (error instanceof MaxInterestsReachedError) {
        throw error;
      }
      this._logger.error("Failed to add user interests", error);
      throw error;
    }

    // Get the updated interests with full details
    const userInterests = await this._userInterestRepo.findByUser(userId);

    this._logger.info("Successfully added user interests", {
      userId,
      count: interestIds.length,
    });

    return InterestApplicationMapper.toResponseList(userInterests);
  }
}
