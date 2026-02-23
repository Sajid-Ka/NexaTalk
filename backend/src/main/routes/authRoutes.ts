import { Router } from "express";
import { authController, sessionController } from "../containers/authContainer";
import { validate } from "../../interfaces/auth/validators/validate";
import { registerSchema } from "../../interfaces/auth/validators/registerValidator";
import { loginSchema } from "../../interfaces/auth/validators/loginValidator";
import { authLimiter } from "../middlewares/authLimiter";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/signup", validate(registerSchema), authController.signup);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authLimiter, authController.refresh);

router.post("/logout", sessionController.logout);
router.delete("/logout-all", authMiddleware, sessionController.logoutAll);
router.get("/sessions", authMiddleware, sessionController.sessions);
router.delete("/sessions/:sessionId", authMiddleware,sessionController.revoke);

export default router;
