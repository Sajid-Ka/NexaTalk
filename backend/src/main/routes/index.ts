import { Router } from "express";
import authRoutes from "./authRoutes";
import healthRoutes from "./healthRoutes";
import adminRoutes from "./adminRoutes";
import interestRoutes from "./interestRoutes";
import onboardingRoutes from "./onboardingRoutes";
import recommendationRoutes from "./recommendationRoutes";
import userRoutes from "./userSettingsRoutes";
import profileRoutes from "./profileRoutes";
import friendRoutes from "./friendRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/admin", adminRoutes);
router.use("/interests", interestRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/user", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/friends", friendRoutes);

export default router;
