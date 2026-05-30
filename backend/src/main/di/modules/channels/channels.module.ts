import { Container } from "inversify";
import { CHANNELS_TYPES } from "./channels.types";

import { ChannelRepository } from "../../../../infrastructure/features/channels/repositories/ChannelRepository";

import { GetChannels } from "../../../../application/channels/usecases/GetChannels";
import { CreateChannel } from "../../../../application/channels/usecases/CreateChannel";

import { IGetChannelsUsecase } from "../../../../application/channels/interfaces/IGetChannelsUsecase";
import { ICreateChannelUsecase } from "../../../../application/channels/interfaces/ICreateChannelUsecase";

import { ChannelController } from "../../../../presentation/channels/controllers/ChannelController";

export function loadChannelsModule(container: Container) {
  container.bind(CHANNELS_TYPES.ChannelRepository).to(ChannelRepository).inSingletonScope();

  container.bind<IGetChannelsUsecase>(CHANNELS_TYPES.GetChannels).to(GetChannels);
  container.bind<ICreateChannelUsecase>(CHANNELS_TYPES.CreateChannel).to(CreateChannel);

  container.bind<ChannelController>(CHANNELS_TYPES.ChannelController).to(ChannelController);
}
