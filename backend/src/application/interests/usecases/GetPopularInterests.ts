import { inject, injectable } from "inversify";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IInterestRepository } from "../../../domain/features/interests/repositories/IInterestRepository";
import { IGetPopularInterestsUseCase } from "../interfaces/IGetPopularInterestsUsecase";
import { InterestResponse } from "../dtos/responses/InterestResponse";
import { InterestApplicationMapper } from "../mappers/InterestMapper";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class GetPopularInterests implements IGetPopularInterestsUseCase {
  constructor(
    @inject(INTERESTS_TYPES.InterestRepository) private readonly _interestRepo: IInterestRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(limit: number = 20): Promise<InterestResponse[]> {
    this._logger.info("Fetching popular interests", { limit });

    const interests = await this._interestRepo.getPopular(limit);

    return InterestApplicationMapper.toResponseList(interests);
  }
}
