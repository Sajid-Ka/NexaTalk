import { Response } from "express";
import { inject, injectable } from "inversify";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { MESSAGES_TYPES } from "../../../main/di/modules/messages/messages.types";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetDirectConversationsUsecase } from "../../../application/messages/interfaces/IGetDirectConversationsUsecase";
import { ICreateDirectConversationUsecase } from "../../../application/messages/interfaces/ICreateDirectConversationUsecase";
import { CreateDirectConversationRequest } from "../../../application/messages/dtos/requests/CreateDirectConversationRequest";
import { IGetConversationMessagesUsecase } from "../../../application/messages/interfaces/IGetConversationMessagesUsecase";
import { GetConversationMessagesRequest } from "../../../application/messages/dtos/requests/GetConversationMessagesRequest";
import { ISendMessageUsecase } from "../../../application/messages/interfaces/ISendMessageUsecase";
import { SendMessageRequest } from "../../../application/messages/dtos/requests/SendMessageRequest";
import { IEditMessageUsecase } from "../../../application/messages/interfaces/IEditMessageUsecase";
import { EditMessageRequest } from "../../../application/messages/dtos/requests/EditMessageRequest";
import { IDeleteMessageUsecase } from "../../../application/messages/interfaces/IDeleteMessageUsecase";
import { IMarkAsReadUsecase } from "../../../application/messages/interfaces/IMarkAsReadUsecase";
import { MarkAsReadRequest } from "../../../application/messages/dtos/requests/MarkAsReadRequest";

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
}
