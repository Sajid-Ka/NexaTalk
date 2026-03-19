export interface IRemoveUserInterestsUseCase {
  execute(userId: string, interestIds: string[]): Promise<void>;
}
