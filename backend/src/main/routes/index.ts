import { Router } from "express";
import authRoutes from "./authRoutes";
import healthRoutes from "./healthRoutes";
import adminRoutes from "./admins";
import interestRoutes from "./interestRoutes";
import onboardingRoutes from "./onboardingRoutes";
import recommendationRoutes from "./recommendationRoutes";
import recommendationV1Routes from "./recommendationV1Routes";
import userRoutes from "./userSettingsRoutes";
import profileRoutes from "./profileRoutes";
import friendRoutes from "./friendRoutes";
import serverRoutes from "./servers";
import channelRoutes from "./channels";
import accountRoutes from "./accountRoutes";
import messageRoutes from "./messageRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/admin", adminRoutes);
router.use("/interests", interestRoutes);
router.use("/onboarding", onboardingRoutes);
router.use("/recommendations", recommendationRoutes);
router.use("/recommendations/v1", recommendationV1Routes);
router.use("/user", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/friends", friendRoutes);
router.use("/servers", serverRoutes);
router.use("/servers", channelRoutes);
router.use("/users", accountRoutes);
router.use("/messages", messageRoutes);

export default router;
