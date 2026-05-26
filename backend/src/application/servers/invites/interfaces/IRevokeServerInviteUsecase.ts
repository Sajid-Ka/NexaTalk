export interface IRevokeServerInviteUsecase {
  execute(serverId: string, userId: string, inviteId: string): Promise<void>;
}
