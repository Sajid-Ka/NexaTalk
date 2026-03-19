import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { INTERESTS_TYPES } from "../../../main/di/modules/interests/interests.types";
import { IUserRepository } from "../../../domain/features/auth/repositories/IUserRepository";
import { IUserInterestRepository } from "../../../domain/features/interests/repositories/IUserInterestRepository";
import { IInterestRepository } from "../../../domain/features/interests/repositories/IInterestRepository";
import { ICompleteOnboardingUseCase } from "../interfaces/ICompleteOnboardingUsecase";
import { CompleteOnboardingRequest } from "../dtos/requests/CompleteOnboardingRequest";
import { OnboardingResponse } from "../dtos/responses/OnboardingResponse";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ITransactionManager } from "../../../domain/core/common/services/ITransactionManager";
import { NotFoundError } from "../../../domain/core/errors/NotFoundError";

@injectable()
export class CompleteOnboarding implements ICompleteOnboardingUseCase {
  constructor(
    @inject(AUTH_TYPES.UserRepository) private readonly _userRepo: IUserRepository,
    @inject(INTERESTS_TYPES.UserInterestRepository)
    private readonly _userInterestRepo: IUserInterestRepository,
    @inject(INTERESTS_TYPES.InterestRepository) private readonly _interestRepo: IInterestRepository,
    @inject(COMMON_TYPES.TransactionManager)
    private readonly _transactionManager: ITransactionManager,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string, request: CompleteOnboardingRequest): Promise<OnboardingResponse> {
    this._logger.info("Completing onboarding", { userId, hasInterests: !!request.interests });

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.hasCompletedOnboarding) {
      this._logger.warn("User already completed onboarding", { userId });
      return {
        success: true,
        completedAt: user.updatedAt,
        interestsAdded: 0,
        skipped: true,
      };
    }

    let interestsAdded = 0;
    const skipped = !request.interests || request.interests.length === 0;

    await this._transactionManager.run(async (session) => {
      // Mark onboarding as complete
      await this._userRepo.update(userId, { hasCompletedOnboarding: true }, session);

      if (!skipped && request.interests && request.interests.length > 0) {
        try {
          const interestIds: string[] = [];
          for (const name of request.interests) {
            const interest = await this._interestRepo.findOrCreate(name.trim());
            interestIds.push(interest.id);
          }

          if (interestIds.length > 0) {
            await this._userInterestRepo.addInterests(userId, interestIds);
            interestsAdded = interestIds.length;
            this._logger.info("Added interests during onboarding", {
              userId,
              count: interestsAdded,
            });
          }
        } catch (interestError) {
          this._logger.error("Failed to add interests during onboarding", interestError);
        }
      }
    });

    this._logger.info("Onboarding completed", {
      userId,
      skipped,
      interestsAdded,
    });

    return {
      success: true,
      completedAt: new Date(),
      interestsAdded,
      skipped,
    };
  }
}
