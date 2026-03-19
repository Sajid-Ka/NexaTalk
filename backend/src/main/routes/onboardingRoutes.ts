import { Router } from "express";
import { container } from "../di/container";
import { ONBOARDING_TYPES } from "../di/modules/onboarding/onboarding.types";
import { OnboardingController } from "../../presentation/onboarding/controllers/OnboardingController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import { completeOnboardingSchema } from "../../presentation/onboarding/validators/completeOnboardingValidator";

const router = Router();

const controller = container.get<OnboardingController>(ONBOARDING_TYPES.OnboardingController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.post("/complete", validate(completeOnboardingSchema), controller.completeOnboarding);

export default router;
