import { Router } from "express";
import { container } from "../di/container";
import { HealthController } from "../../presentation/health/controllers/HealthController";
import { HEALTH_TYPES } from "../di/modules/health/health.types";

const router = Router();

const controller = container.get<HealthController>(HEALTH_TYPES.HealthController);

router.get("/",controller.check.bind(controller));

export default router;