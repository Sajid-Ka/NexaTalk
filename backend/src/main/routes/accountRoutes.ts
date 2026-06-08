import { Router } from "express";
import { container } from "../di/container";
import { USER_TYPES } from "../di/modules/user/user.types";
import { AccountController } from "../../presentation/user/controllers/AccountController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import {
  changePasswordSchema,
  changeEmailSchema,
} from "../../presentation/user/validators/accountValidator";

const router = Router();

const controller = container.get<AccountController>(USER_TYPES.AccountController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.put("/me/password", validate(changePasswordSchema), controller.changePassword);
router.put("/me/email", validate(changeEmailSchema), controller.changeEmail);
router.delete("/me", controller.deleteAccount);

export default router;
