import { Response } from "express";
import { inject, injectable } from "inversify";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { MESSAGES_TYPES } from "../../../main/di/modules/messages/messages.types";
import { successResponse } from "../../../shared/response/responseFormatter";
import { ICreateDirectConversationUsecase } from "../../../application/messages/interfaces/ICreateDirectConversationUsecase";
import { CreateDirectConversationRequest } from "../../../application/messages/dtos/requests/CreateDirectConversationRequest";

@injectable()
export class ConversationController {
  constructor(
    @inject(MESSAGES_TYPES.CreateDirectConversationUsecase)
    private readonly _createDirectConversation: ICreateDirectConversationUsecase,
  ) {}

  createDirectConversation = async (req: AuthenticatedRequest, res: Response) => {
    const request: CreateDirectConversationRequest = {
      targetUserId: req.body.targetUserId,
    };

    const conversation = await this._createDirectConversation.execute(req.user!.userId, request);

    res.json(successResponse(conversation, "Direct conversation created successfully"));
  };
}
