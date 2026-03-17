export interface IDeleteUserUsecase {
  execute(userId: string, adminId: string): Promise<void>;
}
