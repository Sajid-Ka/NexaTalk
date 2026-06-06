export interface ITransferOwnershipUsecase {
  execute(serverId: string, currentOwnerId: string, newOwnerId: string): Promise<void>;
}
