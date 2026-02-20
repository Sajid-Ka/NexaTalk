import { Router } from "express";
import { authController } from "../container";

const router = Router();

router.post("/signup", authController.signup);

export default router;
