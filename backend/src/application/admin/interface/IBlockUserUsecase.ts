export interface IBlockUserUsecase {
  execute(userId: string): Promise<void>;
}
