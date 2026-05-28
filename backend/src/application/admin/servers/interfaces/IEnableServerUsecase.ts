export interface IEnableServerUsecase {
  execute(serverId: string): Promise<void>;
}
