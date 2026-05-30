import { Router } from "express";
import { container } from "../../di/container";
import { ChannelController } from "../../../presentation/channels/controllers/ChannelController";
import { createAuthMiddleware } from "../../middlewares/authMiddleware";
import { AUTH_TYPES } from "../../di/modules/auth/auth.types";
import { ITokenService } from "../../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../../presentation/validators.ts/validate";
import { createServerChannelSchema } from "../../../presentation/channels/validators/createServerChannelValidator";
import { CHANNELS_TYPES } from "../../di/modules/channels/channels.types";

const router = Router();

const controller = container.get<ChannelController>(CHANNELS_TYPES.ChannelController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

router.get("/:serverId/channels", controller.getChannels);
router.post("/:serverId/channels", validate(createServerChannelSchema), controller.createChannel);

export default router;
