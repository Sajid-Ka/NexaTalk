export interface IUnbanServerMemberUsecase {
  execute(serverId: string, currentUserId: string, targetUserId: string): Promise<void>;
}
