import { Router } from "express";
import { container } from "../di/container";
import { createAuthMiddleware } from "../middlewares/authMiddleware";
import { validate } from "../../presentation/validators.ts/validate";
import { createDirectConversationSchema } from "../../presentation/messages/validators/direct/createDirectConversationValidator";
import { MessageController } from "../../presentation/messages/controllers/MessageController";
import { MESSAGES_TYPES } from "../di/modules/messages/messages.types";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { AUTH_TYPES } from "../di/modules/auth/auth.types";
import { getConversationMessagesSchema } from "../../presentation/messages/validators/shared/getConversationMessagesValidator";
import { ValidationSource } from "../../shared/constants/validation.const";
import { sendMessageSchema } from "../../presentation/messages/validators/shared/sendMessageValidator";
import { editMessageSchema } from "../../presentation/messages/validators/shared/editMessageValidator";
import { deleteMessageSchema } from "../../presentation/messages/validators/shared/deleteMessageValidator";
import { markAsReadSchema } from "../../presentation/messages/validators/shared/markAsReadValidator";
import { createGroupSchema } from "../../presentation/messages/validators/group/createGroupValidator";
import { updateGroupMemberRoleSchema } from "../../presentation/messages/validators/group/updateGroupMemberRoleValidator";
import { transferGroupOwnershipSchema } from "../../presentation/messages/validators/group/transferGroupOwnershipValidator";
import { addGroupMembersSchema } from "../../presentation/messages/validators/group/addGroupMembersValidator";
import { renameGroupSchema } from "../../presentation/messages/validators/group/renameGroupValidator";
import { upload } from "../../infrastructure/core/storage/multer.config";
const router = Router();

const controller = container.get<MessageController>(MESSAGES_TYPES.MessageController);

const tokenService = container.get<ITokenService>(AUTH_TYPES.TokenService);
const userStatusService = container.get<IUserStatusService>(AUTH_TYPES.UserStatusService);
const authMiddleware = createAuthMiddleware(tokenService, userStatusService);

router.get("/direct", authMiddleware, controller.getDirectConversations);
router.post(
  "/direct",
  authMiddleware,
  validate(createDirectConversationSchema),
  controller.createDirectConversation,
);

router.get(
  "/servers/:serverId/channels/:channelId/conversation",
  authMiddleware,
  controller.getChannelConversation,
);

router.get(
  "/conversations/:conversationId/messages",
  authMiddleware,
  validate(getConversationMessagesSchema, ValidationSource.QUERY),
  controller.getConversationMessages,
);

router.post("/", authMiddleware, validate(sendMessageSchema), controller.sendMessage);
router.patch("/", authMiddleware, validate(editMessageSchema), controller.editMessage);
router.delete(
  "/for-me",
  authMiddleware,
  validate(deleteMessageSchema),
  controller.deleteMessageForMe,
);
router.delete("/", authMiddleware, validate(deleteMessageSchema), controller.deleteMessage);
router.post("/read", authMiddleware, validate(markAsReadSchema), controller.markAsRead);

router.get("/groups", authMiddleware, controller.getGroups);
router.post("/groups", authMiddleware, validate(createGroupSchema), controller.createGroup);

router.patch(
  "/groups/:conversationId/members/:userId/role",
  authMiddleware,
  validate(updateGroupMemberRoleSchema),
  controller.updateGroupMemberRole,
);

router.post("/groups/:conversationId/leave", authMiddleware, controller.leaveGroup);

router.post(
  "/groups/:conversationId/transfer-owner",
  authMiddleware,
  validate(transferGroupOwnershipSchema),
  controller.transferGroupOwnership,
);

router.delete(
  "/groups/:conversationId/members/:userId",
  authMiddleware,
  controller.removeGroupMember,
);

router.post(
  "/groups/:conversationId/members",
  authMiddleware,
  validate(addGroupMembersSchema),
  controller.addGroupMembers,
);

router.post(
  "/groups/:conversationId/avatar",
  authMiddleware,
  upload.single("avatar"),
  controller.uploadGroupAvatar,
);

router.patch(
  "/groups/:conversationId",
  authMiddleware,
  validate(renameGroupSchema),
  controller.renameGroup,
);

router.delete("/groups/:conversationId", authMiddleware, controller.deleteGroup);

export default router;
