import { Router } from "express";
import { validate } from "../../presentation/auth/validators/validate";
import { registerSchema } from "../../presentation/auth/validators/registerValidator";
import { loginSchema } from "../../presentation/auth/validators/loginValidator";
import { rateLimit } from "../../infrastructure/http/middlewares/rateLimit.middleware";
import { verifyEmailSchema } from "../../presentation/auth/validators/verifyEmailValidator";
import { container } from "../di/container";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { ITokenService } from "../../domain/auth/services/ITokenService";
import { AuthController } from "../../presentation/auth/controllers/AuthController";
import { SessionController } from "../../presentation/auth/controllers/SessionController";

const router = Router();

const authController = container.get<AuthController>(AUTH_TYPES.AuthController);
const sessionController = container.get<SessionController>(AUTH_TYPES.SessionController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const authMiddleware = createAuthMiddleware(tokenService);

router.post("/signup", rateLimit("signup",3,60), validate(registerSchema), authController.signup);
router.post("/verify-email", validate(verifyEmailSchema), authController.verifyEmail.bind(authController));
router.post("/login", rateLimit("login",5,60), validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);

router.post("/logout", sessionController.logout);
router.delete("/logout-all", authMiddleware, sessionController.logoutAll);
router.get("/sessions", authMiddleware, sessionController.sessions);
router.delete("/sessions/:sessionId", authMiddleware, sessionController.revoke);

router.post("/request-password-reset", rateLimit("reset",3,60), authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

export default router;
