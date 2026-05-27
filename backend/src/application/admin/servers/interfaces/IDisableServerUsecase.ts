export interface IDisableServerUsecase {
  execute(serverId: string): Promise<void>;
}