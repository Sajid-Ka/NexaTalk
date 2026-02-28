import { Router } from "express";
import { authController, sessionController } from "../containers/authContainer";
import { validate } from "../../presentation/auth/validators/validate";
import { registerSchema } from "../../presentation/auth/validators/registerValidator";
import { loginSchema } from "../../presentation/auth/validators/loginValidator";
import { authLimiter } from "../middlewares/authLimiter";
import { authMiddleware } from "../containers/authContainer";

const router = Router();

router.post("/signup", validate(registerSchema), authController.signup);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);

router.post("/logout", sessionController.logout);
router.delete("/logout-all", authMiddleware, sessionController.logoutAll);
router.get("/sessions", authMiddleware, sessionController.sessions);
router.delete("/sessions/:sessionId", authMiddleware, sessionController.revoke);

export default router;
