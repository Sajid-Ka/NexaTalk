export interface IDeleteAccountUsecase {
  execute(userId: string): Promise<void>;
}
