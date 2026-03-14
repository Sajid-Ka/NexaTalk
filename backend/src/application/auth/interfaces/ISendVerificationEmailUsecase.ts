export interface ISendVerificationEmailUsecase {
  execute(userId: string): Promise<void>;
}
