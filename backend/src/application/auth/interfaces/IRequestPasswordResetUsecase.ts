export interface IRequestPasswordResetUsecase {
  execute(email: string): Promise<void>;
}
