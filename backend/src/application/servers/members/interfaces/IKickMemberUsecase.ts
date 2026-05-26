export interface IKickMemberUsecase {
  execute(serverId: string, currentUserId: string, targetUserId: string): Promise<void>;
}
