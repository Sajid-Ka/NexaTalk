export interface IRemoveFriendUsecase {
  execute(userId: string, friendId: string): Promise<void>;
}
