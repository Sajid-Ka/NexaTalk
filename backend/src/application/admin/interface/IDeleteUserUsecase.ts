export interface IDeleteUserUsecase {
  execute(userId: string): Promise<void>;
}
