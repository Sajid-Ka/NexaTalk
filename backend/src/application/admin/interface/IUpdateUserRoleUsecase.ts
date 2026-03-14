export interface IUpdateUserRoleUsecase {
  execute(userId: string, role: string): Promise<void>;
}
