import { inject, injectable } from "inversify";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IUserInterestRepository } from "../../../domain/interests/repositories/IUserInterestRepository";
import { IGetUserInterestsUseCase } from "../interfaces/IGetUserInterestsUsecase";
import { InterestResponse } from "../dtos/responses/InterestResponse";
import { InterestApplicationMapper } from "../mappers/InterestMapper";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class GetUserInterests implements IGetUserInterestsUseCase {
  constructor(
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<InterestResponse[]> {
    this._logger.info("Fetching user interests", { userId });

    const interests = await this._userInterestRepo.findByUser(userId);

    return InterestApplicationMapper.toResponseList(interests);
  }
}
