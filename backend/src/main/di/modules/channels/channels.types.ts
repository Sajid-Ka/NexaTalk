export const CHANNELS_TYPES = {
  //Repositories
  ChannelRepository: Symbol.for("ChannelRepository"),

  //usecases
  GetChannels: Symbol.for("GetChannels"),
  CreateChannel: Symbol.for("CreateChannel"),

  //controllers
  ChannelController: Symbol.for("ChannelController"),
};
