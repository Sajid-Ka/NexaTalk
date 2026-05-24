import { Router } from "express";
import { container } from "../../di/container";
import { SERVERS_TYPES } from "../../di/modules/servers/servers.types";
import { ServerCoreController } from "../../../presentation/servers/controllers/ServerCoreController";
import { createAuthMiddleware } from "../../middlewares/authMiddleware";
import { AUTH_TYPES } from "../../di/modules/auth/auth.types";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../../presentation/validators.ts/validate";
import { createServerSchema } from "../../../presentation/servers/validators/core/createServerValidator";
import { updateServerSchema } from "../../../presentation/servers/validators/core/updateServerValidator";

const router = Router();

const controller = container.get<ServerCoreController>(SERVERS_TYPES.ServerCoreController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);

const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);

const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.post("/", validate(createServerSchema), controller.createServer);

router.get("/user", controller.getUserServers);

router.get("/public", controller.getPublicServers);

router.get("/:serverId", controller.getServer);

router.patch("/:serverId", validate(updateServerSchema), controller.updateServer);

router.delete("/:serverId", controller.deleteServer);

export default router;
