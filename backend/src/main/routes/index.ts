import { Router } from "express";
import authRoutes from "./authRoutes";
import healthRoutes from "./healthRoutes";
import adminRoutes from "./admins";
import interestRoutes from "./interestRoutes";
import onboardingRoutes from "./onboardingRoutes";
import recommendationRoutes from "./recommendationRoutes";
import userRoutes from "./userSettingsRoutes";
import profileRoutes from "./profileRoutes";
import friendRoutes from "./friendRoutes";
import serverRoutes from "./servers";

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
router.use("/servers", serverRoutes);

export default router;
