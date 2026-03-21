export interface IDeleteAvatarUsecase {
  execute(userId: string): Promise<void>;
}
