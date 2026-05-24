export interface ILeaveServerUsecase {
  execute(serverId: string, userId: string): Promise<void>;
}
