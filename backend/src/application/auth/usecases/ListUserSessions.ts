import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { SessionListResponse } from "../dtos/responses/SessionListResponse";
import { IListUserSessionUsecase } from "../interfaces/IListUserSessionsUsecase";

export class ListUserSessions implements IListUserSessionUsecase {
  constructor(private refreshRepo: IRefreshTokenRepository) {}

  async execute(userId: string): Promise<SessionListResponse[]> {
    const sessions = await this.refreshRepo.findActiveByUser(userId);

    return sessions.map((sessions) => ({
        id: sessions.id!,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        expiresAt: sessions.expiresAt,
    }));
  }
}
