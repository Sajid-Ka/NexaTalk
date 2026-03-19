import { CompleteOnboardingRequest } from "../dtos/requests/CompleteOnboardingRequest";
import { OnboardingResponse } from "../dtos/responses/OnboardingResponse";

export interface ICompleteOnboardingUseCase {
  execute(userId: string, request: CompleteOnboardingRequest): Promise<OnboardingResponse>;
}
