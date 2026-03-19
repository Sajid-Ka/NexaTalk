import { Container } from "inversify";
import { ONBOARDING_TYPES } from "./onboarding.types";

import { CompleteOnboarding } from "../../../../application/onboarding/usecases/CompleteOnboarding";

import { OnboardingController } from "../../../../presentation/onboarding/controllers/OnboardingController";

export function loadOnboardingModule(container: Container) {
  container.bind(ONBOARDING_TYPES.CompleteOnboarding).to(CompleteOnboarding);

  container.bind(ONBOARDING_TYPES.OnboardingController).to(OnboardingController);
}
