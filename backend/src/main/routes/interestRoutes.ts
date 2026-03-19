import { Router } from "express";
import { container } from "../di/container";
import { INTERESTS_TYPES } from "../di/modules/interests/interests.types";
import { InterestController } from "../../presentation/interests/controllers/InterestController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import { addInterestsSchema } from "../../presentation/interests/validators/addInterestValidator";
import { removeInterestsSchema } from "../../presentation/interests/validators/removeInterestValidator";
import { searchInterestsQuerySchema } from "../../presentation/interests/validators/searchInterestValidator";
import { ValidationSource } from "../../shared/constants/validation.const";

const router = Router();

const controller = container.get<InterestController>(INTERESTS_TYPES.InterestController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

// Search and get popular (public)
router.get(
  "/search",
  validate(searchInterestsQuerySchema, ValidationSource.QUERY),
  controller.search,
);
router.get("/popular", controller.getPopular);

// User's own interests
router.get("/me", controller.getMyInterests);
router.post("/me", validate(addInterestsSchema), controller.addInterests);
router.delete("/me", validate(removeInterestsSchema), controller.removeInterests);

// Other users' interests (public)
router.get("/users/:userId", controller.getUserInterests);

export default router;
