export interface IBlockUserUsecase {
  execute(userId: string, adminId: string): Promise<void>;
}
