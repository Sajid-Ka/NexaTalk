import { Router } from "express";
import { container } from "../di/container";
import { AdminUserController } from "../../presentation/admin/controllers/AdminUserController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { ADMIN_TYPES } from "../di/modules/admin/admin.types";
import { validate } from "../../presentation/validators.ts/validate";
import { listUsersQuerySchema } from "../../presentation/admin/validators/listUsersValidator";
import { updateRoleSchema } from "../../presentation/admin/validators/updateRoleValidator";
import { GlobalRole } from "../../shared/constants/userRole.const";
import { ValidationSource } from "../../shared/constants/validation.const";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";

const router = Router();

const controller = container.get<AdminUserController>(ADMIN_TYPES.AdminUserController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);
router.use(requireRole(GlobalRole.ADMIN));

router.get("/users", validate(listUsersQuerySchema, ValidationSource.QUERY), controller.listUsers);
router.get("/users/:id", controller.getUserDetails);
router.patch("/users/:id/block", controller.blockUser);
router.patch("/users/:id/unblock", controller.unblockUser);
router.patch("/users/:id/role", validate(updateRoleSchema), controller.updateRole);
router.post("/users/:id/force-logout", controller.forceLogoutUser);
router.delete("/users/:id", controller.deleteUser);

export default router;
