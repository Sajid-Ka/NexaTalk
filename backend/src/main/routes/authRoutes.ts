import { Router } from "express";
import { authController } from "../container";
import { validate } from "../../interfaces/auth/validators/validate";
import { registerSchema } from "../../interfaces/auth/validators/registerValidator";
import { loginSchema } from "../../interfaces/auth/validators/loginValidator";
import { authLimiter } from "../middlewares/authLimiter";

const router = Router();

router.post("/signup", validate(registerSchema), authController.signup);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authLimiter, authController.refresh);
router.post("/logout", authController.logout);

export default router;
