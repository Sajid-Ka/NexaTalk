export interface IDeleteServerUsecase {
  execute(serverId: string, userId: string): Promise<void>;
}