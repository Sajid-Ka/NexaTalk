import { Router } from "express";
import { container } from "../di/container";
import { USER_TYPES } from "../di/modules/user/user.types";
import { UserSettingsController } from "../../presentation/user/controllers/UserSettingsController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import { updateUserSettingsSchema } from "../../presentation/user/validators/updateUserSettingsValidator";

const router = Router();

const controller = container.get<UserSettingsController>(USER_TYPES.UserSettingsController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.get("/settings", controller.getSettings);
router.patch("/settings", validate(updateUserSettingsSchema), controller.updateSettings);

export default router;
