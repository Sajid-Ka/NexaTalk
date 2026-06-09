import { Router } from "express";
import { validate } from "../../presentation/validators.ts/validate";
import { registerSchema } from "../../presentation/auth/validators/registerValidator";
import { loginSchema } from "../../presentation/auth/validators/loginValidator";
import { googleLoginSchema } from "../../presentation/auth/validators/googleLoginValidator";
import { rateLimit } from "../../infrastructure/core/http/middlewares/rateLimit.middleware";
import { verifyEmailSchema } from "../../presentation/auth/validators/verifyEmailValidator";
import { requestVerificationEmailSchema } from "../../presentation/auth/validators/requestVerificationEmailValidator";
import { container } from "../di/container";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { AuthController } from "../../presentation/auth/controllers/AuthController";
import { SessionController } from "../../presentation/auth/controllers/SessionController";
import { env } from "../../shared/config/env";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";

const router = Router();

const authController = container.get<AuthController>(AUTH_TYPES.AuthController);
const sessionController = container.get<SessionController>(AUTH_TYPES.SessionController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.post(
  "/signup",
  rateLimit("signup", env.RATE_LIMIT_SIGNUP, env.RATE_LIMIT_WINDOW_SECONDS),
  validate(registerSchema),
  authController.signup,
);
router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  authController.verifyEmail.bind(authController),
);
router.post(
  "/resend-verification-email",
  rateLimit("verify-email", env.RATE_LIMIT_RESET, env.RATE_LIMIT_WINDOW_SECONDS),
  validate(requestVerificationEmailSchema),
  authController.requestVerificationEmail,
);
router.post(
  "/login",
  rateLimit("login", env.RATE_LIMIT_LOGIN, env.RATE_LIMIT_WINDOW_SECONDS),
  validate(loginSchema),
  authController.login,
);
router.post(
  "/google",
  rateLimit("login", env.RATE_LIMIT_LOGIN, env.RATE_LIMIT_WINDOW_SECONDS),
  validate(googleLoginSchema),
  authController.googleLogin,
);
router.post("/refresh", authController.refresh);

router.post("/logout", sessionController.logout);
router.delete("/logout-all", authMiddleware, sessionController.logoutAll);
router.get("/sessions", authMiddleware, sessionController.sessions);
router.delete("/sessions/:sessionId", authMiddleware, sessionController.revoke);

router.post(
  "/request-password-reset",
  rateLimit("reset", env.RATE_LIMIT_RESET, env.RATE_LIMIT_WINDOW_SECONDS),
  authController.requestPasswordReset,
);
router.post("/reset-password", authController.resetPassword);

router.get("/check-status", authMiddleware, authController.checkStatus);

export default router;
