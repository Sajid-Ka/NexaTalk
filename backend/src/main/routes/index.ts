import { Router } from "express";
import authRoutes from "./authRoutes";
import healthRoutes from "./healthRoutes";
import adminRoutes from "./adminRoutes";
import interestRoutes from "./interestRoutes";
import onboardingRoutes from "./onboardingRoutes";
import recommendationRoutes from "./recommendationRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/admin", adminRoutes);
router.use("/interests", interestRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/user", userRoutes);

export default router;
