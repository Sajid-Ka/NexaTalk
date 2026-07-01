import { Response } from "express";
import { inject, injectable } from "inversify";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { MESSAGES_TYPES } from "../../../main/di/modules/messages/messages.types";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetDirectConversationsUsecase } from "../../../application/messages/direct/interfaces/IGetDirectConversationsUsecase";
import { ICreateDirectConversationUsecase } from "../../../application/messages/direct/interfaces/ICreateDirectConversationUsecase";
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

@injectable()
export class MessageController {
  constructor(
    @inject(MESSAGES_TYPES.CreateDirectConversation)
    private readonly _createDirectConversation: ICreateDirectConversationUsecase,
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
}
