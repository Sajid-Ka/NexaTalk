import { Response } from "express";
import { inject, injectable } from "inversify";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetChannelsUsecase } from "../../../application/channels/interfaces/IGetChannelsUsecase";
import { ICreateChannelUsecase } from "../../../application/channels/interfaces/ICreateChannelUsecase";
import { CHANNELS_TYPES } from "../../../main/di/modules/channels/channels.types";

@injectable()
export class ChannelController {
  constructor(
    @inject(CHANNELS_TYPES.GetChannels)
    private readonly _getServerChannels: IGetChannelsUsecase,
    @inject(CHANNELS_TYPES.CreateChannel)
    private readonly _createServerChannel: ICreateChannelUsecase,
  ) {}

  getChannels = async (req: AuthenticatedRequest, res: Response) => {
    const channels = await this._getServerChannels.execute(req.params.serverId, req.user!.userId);

    res.json(successResponse(channels, "Server channels fetched successfully"));
  };

  createChannel = async (req: AuthenticatedRequest, res: Response) => {
    const channel = await this._createServerChannel.execute(
      req.params.serverId,
      req.user!.userId,
      req.body,
    );

    res.status(201).json(successResponse(channel, "Channel created successfully"));
  };
}
