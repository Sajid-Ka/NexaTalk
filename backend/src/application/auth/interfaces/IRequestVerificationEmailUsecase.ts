export interface IRequestVerificationEmailUsecase {
  execute(email: string): Promise<void>;
}
