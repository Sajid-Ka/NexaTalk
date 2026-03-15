export interface IForceLogoutUserUsecase {
  execute(userId: string, adminId: string): Promise<void>;
}
