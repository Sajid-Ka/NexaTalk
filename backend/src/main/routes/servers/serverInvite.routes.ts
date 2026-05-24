import { Router } from "express";

import { container } from "../../di/container";

import { SERVERS_TYPES } from "../../di/modules/servers/servers.types";

import { ServerInviteController } from "../../../presentation/servers/controllers/ServerInviteController";

import { createAuthMiddleware } from "../../middlewares/authMiddleware";

import { AUTH_TYPES } from "../../di/modules/auth/auth.types";

import { ITokenService } from "../../../domain/features/auth/services/ITokenService";

import { IUserStatusService } from "../../../domain/features/auth/services/IUserStatusService";

import { validate } from "../../../presentation/validators.ts/validate";

import { createInviteSchema } from "../../../presentation/servers/validators/invites/createInviteValidator";

const router = Router();

const controller = container.get<ServerInviteController>(SERVERS_TYPES.ServerInviteController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);

const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);

const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.post("/:serverId/invites", validate(createInviteSchema), controller.createInvite);

router.post("/invite/:code", controller.joinByInvite);

export default router;
