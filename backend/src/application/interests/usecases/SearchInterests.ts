import { inject, injectable } from "inversify";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IInterestRepository } from "../../../domain/interests/repositories/IInterestRepository";
import { ISearchInterestsUseCase } from "../interfaces/ISearchInterestsUsecase";
import { SearchInterestsQuery } from "../dtos/requests/SearchInterestsQuery";
import { InterestResponse } from "../dtos/responses/InterestResponse";
import { InterestApplicationMapper } from "../mappers/InterestMapper";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { BadRequestError } from "../../../domain/errors/BadRequestError";

@injectable()
export class SearchInterests implements ISearchInterestsUseCase {
  constructor(
    @inject(INTERESTS_TYPES.InterestRepository) private readonly _interestRepo: IInterestRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(query: SearchInterestsQuery): Promise<InterestResponse[]> {
    this._logger.info("Searching interests", { query });

    if (!query.q || query.q.trim().length < 2) {
      throw new BadRequestError("Search query must be at least 2 characters");
    }

    const limit = query.limit || 10;
    const interests = await this._interestRepo.search(query.q, limit);

    return InterestApplicationMapper.toResponseList(interests);
  }
}
