import { Router } from "express";
import { container } from "../../di/container";
import { SERVERS_TYPES } from "../../di/modules/servers/servers.types";
import { ServerMemberController } from "../../../presentation/servers/controllers/ServerMemberController";
import { createAuthMiddleware } from "../../middlewares/authMiddleware";
import { AUTH_TYPES } from "../../di/modules/auth/auth.types";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../../domain/features/auth/services/IUserStatusService";

const router = Router();

const controller = container.get<ServerMemberController>(SERVERS_TYPES.ServerMemberController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);

const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);

const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.post("/:serverId/join", controller.joinServer);

router.post("/:serverId/leave", controller.leaveServer);

export default router;
