import { Router } from "express";
import { container } from "../di/container";
import { FRIENDS_TYPES } from "../di/modules/friends/friends.types";
import { FriendController } from "../../presentation/friends/controllers/FriendController";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";
import { validate } from "../../presentation/validators.ts/validate";
import { sendFriendRequestSchema } from "../../presentation/friends/validators/sendFriendRequestValidator";
import { respondFriendRequestSchema } from "../../presentation/friends/validators/respondFriendRequestValidator";
import { getFriendsQuerySchema } from "../../presentation/friends/validators/getFriendsQueryValidator";
import { ValidationSource } from "../../shared/constants/validation.const";

const router = Router();

const controller = container.get<FriendController>(FRIENDS_TYPES.FriendController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.use(authMiddleware);

// Friend management
router.get("/", validate(getFriendsQuerySchema, ValidationSource.QUERY), controller.getFriends);
router.post("/", validate(sendFriendRequestSchema), controller.sendFriendRequest);
router.delete("/:userId", controller.removeFriend);

// Friend requests
router.get("/requests", controller.getPendingRequests);
router.patch(
  "/requests/:userId",
  validate(respondFriendRequestSchema),
  controller.respondFriendRequest,
);

export default router;
