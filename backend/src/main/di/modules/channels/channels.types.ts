export const CHANNELS_TYPES = {
  //Repositories
  ChannelRepository: Symbol.for("ChannelRepository"),

  //usecases
  GetChannels: Symbol.for("GetChannels"),
  CreateChannel: Symbol.for("CreateChannel"),
  UpdateChannel: Symbol.for("UpdateChannel"),
  DeleteChannel: Symbol.for("DeleteChannel"),

  //controllers
  ChannelController: Symbol.for("ChannelController"),
};
