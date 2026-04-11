import { Router } from "express";
import { container } from "../di/container";
import { SERVERS_TYPES } from "../di/modules/servers/servers.types";
import { ServerController } from "../../presentation/servers/controllers/ServerController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import { createServerSchema } from "../../presentation/servers/validators/createServerValidator";
import { updateServerSchema } from "../../presentation/servers/validators/updateServerValidator";
import { createInviteSchema } from "../../presentation/servers/validators/createInviteValidator";

const router = Router();

const controller = container.get<ServerController>(SERVERS_TYPES.ServerController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

// Server CRUD
router.post("/", validate(createServerSchema), controller.createServer);
router.get("/user", controller.getUserServers);
router.get("/public", controller.getPublicServers);
router.get("/:serverId", controller.getServer);
router.patch("/:serverId", validate(updateServerSchema), controller.updateServer);
router.delete("/:serverId", controller.deleteServer);

// Server membership
router.post("/:serverId/join", controller.joinServer);
router.post("/:serverId/leave", controller.leaveServer);

// Server invites
router.post("/:serverId/invites", validate(createInviteSchema), controller.createInvite);
router.post("/invite/:code", controller.joinByInvite);

export default router;
