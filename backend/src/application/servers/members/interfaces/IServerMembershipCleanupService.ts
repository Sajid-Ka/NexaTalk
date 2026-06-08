export interface IServerMembershipCleanupService {
  removeMemberAndDecrementCount(serverId: string, userId: string): Promise<void>;
}
