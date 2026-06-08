export interface IVerifyEmailUsecase {
  execute(rawToken: string): Promise<{ message: string }>;
}
