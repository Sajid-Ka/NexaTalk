import { Router } from "express";
import { container } from "../di/container";
import { RECOMMENDATIONS_TYPES } from "../di/modules/recommendations/recommendations.types";
import { RecommendationV1Controller } from "../../presentation/recommendations/controllers/RecommendationV1Controller";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";

const router = Router();

const controller = container.get<RecommendationV1Controller>(
  RECOMMENDATIONS_TYPES.RecommendationV1Controller,
);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.get("/users", controller.getRecommendedUsers);
router.get("/servers", controller.getRecommendedServers);

export default router;
