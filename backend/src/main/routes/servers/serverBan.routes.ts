import { Router } from "express";
import { container } from "../../di/container";
import { SERVERS_TYPES } from "../../di/modules/servers/servers.types";
import { ServerBanController } from "../../../presentation/servers/controllers/ServerBanController";
import { createAuthMiddleware } from "../../middlewares/authMiddleware";
import { AUTH_TYPES } from "../../di/modules/auth/auth.types";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../../presentation/validators.ts/validate";
import { banServerMemberSchema } from "../../../presentation/servers/validators/bans/banServerMemberValidator";

const router = Router();

const controller = container.get<ServerBanController>(SERVERS_TYPES.ServerBanController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);

const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);

const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.get("/:serverId/ban-candidates", controller.searchBanCandidates);
router.get("/:serverId/bans", controller.getBans);
router.post("/:serverId/bans", validate(banServerMemberSchema), controller.banMember);
router.delete("/:serverId/bans/:userId", controller.unbanMember);

export default router;
