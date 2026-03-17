export interface ILogoutUserUsecase {
  execute(refreshToken: string): Promise<void>;
}
