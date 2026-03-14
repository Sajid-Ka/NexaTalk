export interface IUnblockUserUsecase {
  execute(userId: string): Promise<void>;
}
