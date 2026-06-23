import { Router } from "express";
import { container } from "../../di/container";
import { AdminServerController } from "../../../presentation/admin/controllers/AdminServerController";
import { createAuthMiddleware } from "../../middlewares/authMiddleware";
import { requireRole } from "../../middlewares/roleMiddleware";
import { AUTH_TYPES } from "../../di/modules/auth/auth.types";
import { ADMIN_TYPES } from "../../di/modules/admin/admin.types";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../../presentation/validators.ts/validate";
import { listServersQuerySchema } from "../../../presentation/admin/validators/servers/listServersValidator";
import { GlobalRole } from "../../../shared/constants/user.const";
import { ValidationSource } from "../../../shared/constants/validation.const";

const router = Router();

const controller = container.get<AdminServerController>(ADMIN_TYPES.AdminServerController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);

const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);

const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);
router.use(requireRole(GlobalRole.ADMIN));

router.get(
  "/servers",
  validate(listServersQuerySchema, ValidationSource.QUERY),
  controller.listServers,
);

router.get("/servers/:id", controller.getServerDetails);

router.patch("/servers/:id/disable", controller.disableServer);

router.patch("/servers/:id/enable", controller.enableServer);

router.delete("/servers/:id", controller.deleteServer);

export default router;
