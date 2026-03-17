export interface IUnblockUserUsecase {
  execute(userId: string, adminId: string): Promise<void>;
}
