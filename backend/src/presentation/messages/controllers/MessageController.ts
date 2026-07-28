import { Response } from "express";
import { inject, injectable } from "inversify";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { MESSAGES_TYPES } from "../../../main/di/modules/messages/messages.types";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetDirectConversationsUsecase } from "../../../application/messages/direct/interfaces/IGetDirectConversationsUsecase";
import { ICreateDirectConversationUsecase } from "../../../application/messages/direct/interfaces/ICreateDirectConversationUsecase";
import { IGetChannelConversationUsecase } from "../../../application/messages/channel/interfaces/IGetChannelConversationUsecase";
import { CreateDirectConversationRequest } from "../../../application/messages/direct/dtos/requests/CreateDirectConversationRequest";
import { IGetConversationMessagesUsecase } from "../../../application/messages/shared/interfaces/IGetConversationMessagesUsecase";
import { GetConversationMessagesRequest } from "../../../application/messages/shared/dtos/requests/GetConversationMessagesRequest";
import { ISendMessageUsecase } from "../../../application/messages/shared/interfaces/ISendMessageUsecase";
import { SendMessageRequest } from "../../../application/messages/shared/dtos/requests/SendMessageRequest";
import { IEditMessageUsecase } from "../../../application/messages/shared/interfaces/IEditMessageUsecase";
import { EditMessageRequest } from "../../../application/messages/shared/dtos/requests/EditMessageRequest";
import { IDeleteMessageUsecase } from "../../../application/messages/shared/interfaces/IDeleteMessageUsecase";
import { IMarkAsReadUsecase } from "../../../application/messages/shared/interfaces/IMarkAsReadUsecase";
import { MarkAsReadRequest } from "../../../application/messages/shared/dtos/requests/MarkAsReadRequest";
import { ICreateGroupUsecase } from "../../../application/messages/group/interfaces/ICreateGroupUsecase";
import { CreateGroupRequest } from "../../../application/messages/group/dtos/requests/CreateGroupRequest";
import { IGetGroupsUsecase } from "../../../application/messages/group/interfaces/IGetGroupsUsecase";
import { IDeleteMessageForMeUsecase } from "../../../application/messages/shared/interfaces/IDeleteMessageForMeUsecase";
import { IUpdateGroupMemberRoleUsecase } from "../../../application/messages/group/interfaces/IUpdateGroupMemberRoleUsecase";
import { IRemoveGroupMemberUsecase } from "../../../application/messages/group/interfaces/IRemoveGroupMemberUsecase";
import { ILeaveGroupUsecase } from "../../../application/messages/group/interfaces/ILeaveGroupUsecase";
import { ITransferGroupOwnershipUsecase } from "../../../application/messages/group/interfaces/ITransferGroupOwnershipUsecase";
import { IDeleteGroupUsecase } from "../../../application/messages/group/interfaces/IDeleteGroupUsecase";
import { IAddGroupMembersUsecase } from "../../../application/messages/group/interfaces/IAddGroupMembersUsecase";
import { IUploadGroupAvatarUsecase } from "../../../application/messages/group/interfaces/IUploadGroupAvatarUsecase";
import { IRenameGroupUsecase } from "../../../application/messages/group/interfaces/IRenameGroupUsecase";

@injectable()
export class MessageController {
  constructor(
    @inject(MESSAGES_TYPES.CreateDirectConversation)
    private readonly _createDirectConversation: ICreateDirectConversationUsecase,
    @inject(MESSAGES_TYPES.GetChannelConversation)
    private readonly _getChannelConversation: IGetChannelConversationUsecase,
    @inject(MESSAGES_TYPES.GetDirectConversations)
    private readonly _getDirectConversations: IGetDirectConversationsUsecase,
    @inject(MESSAGES_TYPES.GetConversationMessages)
    private readonly _getConversationMessages: IGetConversationMessagesUsecase,
    @inject(MESSAGES_TYPES.SendMessage)
    private readonly _sendMessage: ISendMessageUsecase,
    @inject(MESSAGES_TYPES.EditMessage)
    private readonly _editMessage: IEditMessageUsecase,
    @inject(MESSAGES_TYPES.DeleteMessage)
    private readonly _deleteMessage: IDeleteMessageUsecase,
    @inject(MESSAGES_TYPES.MarkAsRead)
    private readonly _markAsRead: IMarkAsReadUsecase,
    @inject(MESSAGES_TYPES.CreateGroup)
    private readonly _createGroup: ICreateGroupUsecase,
    @inject(MESSAGES_TYPES.GetGroups)
    private readonly _getGroups: IGetGroupsUsecase,
    @inject(MESSAGES_TYPES.DeleteMessageForMe)
    private readonly _deleteMessageForMe: IDeleteMessageForMeUsecase,
    @inject(MESSAGES_TYPES.UpdateGroupMemberRole)
    private readonly _updateGroupMemberRole: IUpdateGroupMemberRoleUsecase,
    @inject(MESSAGES_TYPES.RemoveGroupMember)
    private readonly _removeGroupMember: IRemoveGroupMemberUsecase,
    @inject(MESSAGES_TYPES.LeaveGroup)
    private readonly _leaveGroup: ILeaveGroupUsecase,
    @inject(MESSAGES_TYPES.TransferGroupOwnership)
    private readonly _transferGroupOwnership: ITransferGroupOwnershipUsecase,
    @inject(MESSAGES_TYPES.DeleteGroup)
    private readonly _deleteGroup: IDeleteGroupUsecase,
    @inject(MESSAGES_TYPES.AddGroupMembers)
    private readonly _addGroupMembers: IAddGroupMembersUsecase,
    @inject(MESSAGES_TYPES.UploadGroupAvatar)
    private readonly _uploadGroupAvatar: IUploadGroupAvatarUsecase,
    @inject(MESSAGES_TYPES.RenameGroup)
    private readonly _renameGroup: IRenameGroupUsecase,
  ) {}

  createDirectConversation = async (req: AuthenticatedRequest, res: Response) => {
    const request: CreateDirectConversationRequest = {
      targetUserId: req.body.targetUserId,
    };

    const result = await this._createDirectConversation.execute(req.user!.userId, request);

    res.json(successResponse(result, "Direct conversation retrieved successfully"));
  };

  getDirectConversations = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._getDirectConversations.execute(req.user!.userId);

    res.json(successResponse(result, "Direct conversations retrieved successfully"));
  };

  getChannelConversation = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._getChannelConversation.execute(req.user!.userId, {
      serverId: req.params.serverId,
      channelId: req.params.channelId,
    });

    res.json(successResponse(result, "Channel conversation retrieved successfully"));
  };

  getConversationMessages = async (req: AuthenticatedRequest, res: Response) => {
    const request: GetConversationMessagesRequest = {
      conversationId: req.params.conversationId,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      cursor: req.query.cursor as string | undefined,
    };

    const result = await this._getConversationMessages.execute(req.user!.userId, request);

    res.json(successResponse(result, "Conversation messages retrieved successfully"));
  };

  sendMessage = async (req: AuthenticatedRequest, res: Response) => {
    const request: SendMessageRequest = {
      conversationId: req.body.conversationId,
      content: req.body.content,
    };

    const result = await this._sendMessage.execute(req.user!.userId, request);

    res.json(successResponse(result, "Message sent successfully"));
  };

  editMessage = async (req: AuthenticatedRequest, res: Response) => {
    const request: EditMessageRequest = {
      messageId: req.body.messageId,
      content: req.body.content,
    };

    const result = await this._editMessage.execute(req.user!.userId, request);

    res.json(successResponse(result, "Message updated successfully"));
  };

  deleteMessage = async (req: AuthenticatedRequest, res: Response) => {
    const request = {
      messageId: req.body.messageId,
    };

    const result = await this._deleteMessage.execute(req.user!.userId, request);

    res.json(successResponse(result, "Message deleted successfully"));
  };

  markAsRead = async (req: AuthenticatedRequest, res: Response) => {
    const request: MarkAsReadRequest = {
      conversationId: req.body.conversationId,
      messageId: req.body.messageId,
    };

    const result = await this._markAsRead.execute(req.user!.userId, request);

    res.json(successResponse(result, "Conversation marked as read"));
  };

  createGroup = async (req: AuthenticatedRequest, res: Response) => {
    const request: CreateGroupRequest = {
      name: req.body.name,
      avatar: req.body.avatar,
      participantIds: req.body.participantIds,
    };

    const result = await this._createGroup.execute(req.user!.userId, request);

    res.json(successResponse(result, "Group created successfully"));
  };

  getGroups = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._getGroups.execute(req.user!.userId);

    res.json(successResponse(result, "Groups retrieved successfully"));
  };

  deleteMessageForMe = async (req: AuthenticatedRequest, res: Response) => {
    await this._deleteMessageForMe.execute(req.user!.userId, {
      messageId: req.body.messageId,
    });

    res.json(successResponse(null, "Message deleted for you"));
  };

  updateGroupMemberRole = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._updateGroupMemberRole.execute(req.user!.userId, {
      conversationId: req.params.conversationId,
      userId: req.params.userId,
      role: req.body.role,
    });

    res.json(successResponse(result, "Group member role updated successfully"));
  };

  removeGroupMember = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._removeGroupMember.execute(req.user!.userId, {
      conversationId: req.params.conversationId,
      userId: req.params.userId,
    });

    res.json(successResponse(result, "Group member removed successfully"));
  };

  leaveGroup = async (req: AuthenticatedRequest, res: Response) => {
    await this._leaveGroup.execute(req.user!.userId, {
      conversationId: req.params.conversationId,
    });

    res.json(successResponse(null, "Left group successfully"));
  };

  transferGroupOwnership = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._transferGroupOwnership.execute(req.user!.userId, {
      conversationId: req.params.conversationId,
      newOwnerId: req.body.newOwnerId,
    });

    res.json(successResponse(result, "Group ownership transferred successfully"));
  };

  addGroupMembers = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._addGroupMembers.execute(req.user!.userId, {
      conversationId: req.params.conversationId,
      participantIds: req.body.participantIds,
    });

    res.json(successResponse(result, "Group members added successfully"));
  };

  deleteGroup = async (req: AuthenticatedRequest, res: Response) => {
    await this._deleteGroup.execute(req.user!.userId, {
      conversationId: req.params.conversationId,
    });

    res.json(successResponse(null, "Group deleted successfully"));
  };

  uploadGroupAvatar = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._uploadGroupAvatar.execute(
      req.user!.userId,
      req.params.conversationId,
      req.file!,
    );

    res.json(successResponse(result, "Group avatar uploaded successfully"));
  };

  renameGroup = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this._renameGroup.execute(req.user!.userId, {
      conversationId: req.params.conversationId,
      name: req.body.name,
    });

    res.json(successResponse(result, "Group renamed successfully"));
  };
}
