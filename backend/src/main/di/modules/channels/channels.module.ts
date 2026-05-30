import { Container } from "inversify";
import { CHANNELS_TYPES } from "./channels.types";

import { ChannelRepository } from "../../../../infrastructure/features/channels/repositories/ChannelRepository";

import { GetChannels } from "../../../../application/channels/usecases/GetChannels";
import { CreateChannel } from "../../../../application/channels/usecases/CreateChannel";
import { IGetChannelsUsecase } from "../../../../application/channels/interfaces/IGetChannelsUsecase";
import { ICreateChannelUsecase } from "../../../../application/channels/interfaces/ICreateChannelUsecase";
import { UpdateChannel } from "../../../../application/channels/usecases/UpdateChannel";
import { DeleteChannel } from "../../../../application/channels/usecases/DeleteChannel";
import { IUpdateChannelUsecase } from "../../../../application/channels/interfaces/IUpdateChannelUsecase";
import { IDeleteChannelUsecase } from "../../../../application/channels/interfaces/IDeleteChannelUsecase";

import { ChannelController } from "../../../../presentation/channels/controllers/ChannelController";

export function loadChannelsModule(container: Container) {
  //repository
  container.bind(CHANNELS_TYPES.ChannelRepository).to(ChannelRepository).inSingletonScope();
  //usecases
  container.bind<IGetChannelsUsecase>(CHANNELS_TYPES.GetChannels).to(GetChannels);
  container.bind<ICreateChannelUsecase>(CHANNELS_TYPES.CreateChannel).to(CreateChannel);
  container.bind<IUpdateChannelUsecase>(CHANNELS_TYPES.UpdateChannel).to(UpdateChannel);
  container.bind<IDeleteChannelUsecase>(CHANNELS_TYPES.DeleteChannel).to(DeleteChannel);
  //controller
  container.bind<ChannelController>(CHANNELS_TYPES.ChannelController).to(ChannelController);
}
