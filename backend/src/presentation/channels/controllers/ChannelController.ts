import { Response } from "express";
import { inject, injectable } from "inversify";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { successResponse } from "../../../shared/response/responseFormatter";
import { IGetChannelsUsecase } from "../../../application/channels/interfaces/IGetChannelsUsecase";
import { ICreateChannelUsecase } from "../../../application/channels/interfaces/ICreateChannelUsecase";
import { CHANNELS_TYPES } from "../../../main/di/modules/channels/channels.types";
import { IUpdateChannelUsecase } from "../../../application/channels/interfaces/IUpdateChannelUsecase";
import { IDeleteChannelUsecase } from "../../../application/channels/interfaces/IDeleteChannelUsecase";

@injectable()
export class ChannelController {
  constructor(
    @inject(CHANNELS_TYPES.GetChannels)
    private readonly _getChannels: IGetChannelsUsecase,
    @inject(CHANNELS_TYPES.CreateChannel)
    private readonly _createChannel: ICreateChannelUsecase,
    @inject(CHANNELS_TYPES.UpdateChannel)
    private readonly _updateChannel: IUpdateChannelUsecase,
    @inject(CHANNELS_TYPES.DeleteChannel)
    private readonly _deleteChannel: IDeleteChannelUsecase,
  ) {}

  getChannels = async (req: AuthenticatedRequest, res: Response) => {
    const channels = await this._getChannels.execute(req.params.serverId, req.user!.userId);

    res.json(successResponse(channels, "Server channels fetched successfully"));
  };

  createChannel = async (req: AuthenticatedRequest, res: Response) => {
    const channel = await this._createChannel.execute(
      req.params.serverId,
      req.user!.userId,
      req.body,
    );

    res.status(201).json(successResponse(channel, "Channel created successfully"));
  };

  updateChannel = async (req: AuthenticatedRequest, res: Response) => {
    const channel = await this._updateChannel.execute(
      req.params.serverId,
      req.params.channelId,
      req.user!.userId,
      req.body,
    );

    res.json(successResponse(channel, "Channel updated successfully"));
  };

  deleteChannel = async (req: AuthenticatedRequest, res: Response) => {
    await this._deleteChannel.execute(req.params.serverId, req.params.channelId, req.user!.userId);

    res.json(successResponse(null, "Channel deleted successfully"));
  };
}
