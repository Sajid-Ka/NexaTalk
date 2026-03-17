export interface IRevokeSessionUsecase {
  execute(userId: string, sessionId: string): Promise<void>;
}
