export interface IVerifyEmailUsecase {
  execute(rawToken: string): Promise<void>;
}
