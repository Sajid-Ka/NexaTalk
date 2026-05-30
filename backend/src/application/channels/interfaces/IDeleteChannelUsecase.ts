export interface IDeleteChannelUsecase {
  execute(serverId: string, channelId: string, currentUserId: string): Promise<void>;
}
