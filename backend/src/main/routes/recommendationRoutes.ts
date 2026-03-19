import { Router } from "express";
import { container } from "../di/container";
import { RECOMMENDATIONS_TYPES } from "../di/modules/recommendations/recommendations.types";
import { RecommendationController } from "../../presentation/recommendations/controllers/RecommendationController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import { getRecommendationsQuerySchema } from "../../presentation/recommendations/validators/getRecommendationValidator";
import { ValidationSource } from "../../shared/constants/validation.const";

const router = Router();

const controller = container.get<RecommendationController>(
  RECOMMENDATIONS_TYPES.RecommendationController,
);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.get(
  "/",
  validate(getRecommendationsQuerySchema, ValidationSource.QUERY),
  controller.getRecommendations,
);

export default router;
