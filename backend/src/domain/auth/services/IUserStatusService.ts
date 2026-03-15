export interface IUserStatusService {
  validate(userId: string, sessionVersion: number): Promise<void>;
}
