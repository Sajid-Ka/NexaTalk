import { Router } from "express";
import { container } from "../di/container";
import { AdminUserController } from "../../presentation/admin/controllers/AdminUserController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/auth/services/ITokenService";
import { ADMIN_TYPES } from "../di/modules/admin/admin.types";
import { validate } from "../../presentation/validators.ts/validate";
import { listUsersQuerySchema } from "../../presentation/admin/validators/listUsersValidator";
import { updateRoleSchema } from "../../presentation/admin/validators/updateRoleValidator";

const router = Router();

const controller = container.get<AdminUserController>(ADMIN_TYPES.AdminUserController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const authMiddleware = createAuthMiddleware(tokenService);

router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/users", validate(listUsersQuerySchema,"query"), controller.listUsers);
router.get("/users/:id", controller.getUserDetails);
router.patch("/users/:id/block", controller.blockUser);
router.patch("/users/:id/unblock", controller.unblockUser);
router.patch("/users/:id/role", validate(updateRoleSchema), controller.updateRole);
router.delete("/users/:id", controller.deleteUser);

export default router;