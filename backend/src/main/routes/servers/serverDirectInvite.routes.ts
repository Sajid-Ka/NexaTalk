import { Router } from "express";
import { container } from "../../di/container";
import { SERVERS_TYPES } from "../../di/modules/servers/servers.types";
import { ServerDirectInviteController } from "../../../presentation/servers/controllers/ServerDirectInviteController";
import { createAuthMiddleware } from "../../middlewares/authMiddleware";
import { AUTH_TYPES } from "../../di/modules/auth/auth.types";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../../presentation/validators.ts/validate";
import {
  sendDirectInviteSchema,
  respondDirectInviteSchema,
} from "../../../presentation/servers/validators/invites/directInviteValidator";

const router = Router();

// Setup Authentication Middleware
const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

const controller = container.get<ServerDirectInviteController>(
  SERVERS_TYPES.ServerDirectInviteController,
);

// Send invite
router.post("/:serverId/direct-invites", validate(sendDirectInviteSchema), controller.sendInvite);

// Get my pending invites
router.get("/me/direct-invites", controller.getPendingInvites);

router.get("/:serverId/direct-invites/pending", controller.getServerPendingInvites);

// Accept or Reject an invite
router.patch(
  "/direct-invites/:inviteId/respond",
  validate(respondDirectInviteSchema),
  controller.respondToInvite,
);

export default router;
