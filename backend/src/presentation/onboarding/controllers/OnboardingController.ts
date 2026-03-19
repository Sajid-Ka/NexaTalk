import { Response } from "express";
import { injectable, inject } from "inversify";
import { ONBOARDING_TYPES } from "../../../main/di/modules/onboarding/onboarding.types";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { ICompleteOnboardingUseCase } from "../../../application/onboarding/interfaces/ICompleteOnboardingUsecase";
import { CompleteOnboardingRequest } from "../../../application/onboarding/dtos/requests/CompleteOnboardingRequest";

@injectable()
export class OnboardingController {
  constructor(
    @inject(ONBOARDING_TYPES.CompleteOnboarding)
    private readonly _completeOnboarding: ICompleteOnboardingUseCase,
  ) {}

  completeOnboarding = async (req: AuthenticatedRequest, res: Response) => {
    const request: CompleteOnboardingRequest = {
      interests: req.body.interests,
    };

    const result = await this._completeOnboarding.execute(req.user!.userId, request);

    res.json(successResponse(result, "Onboarding completed successfully"));
  };
}
