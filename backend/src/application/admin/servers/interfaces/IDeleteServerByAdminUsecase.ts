export interface IDeleteServerByAdminUsecase {
  execute(serverId: string): Promise<void>;
}
