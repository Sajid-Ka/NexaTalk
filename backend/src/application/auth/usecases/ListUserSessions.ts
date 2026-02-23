import { IRefreshTokenRepository } from "../../../domain/auth/interfaces/IRefreshTokenRepository";
import { SessionListResponse } from "../dtos/responses/SessionListResponse";

export class ListUserSessions {
  constructor(private refreshRepo: IRefreshTokenRepository) {}

  async execute(userId: string): Promise<SessionListResponse[]> {
    const sessions = await this.refreshRepo.findActiveByUser(userId);

    return sessions.map((sessions) => ({
      ipAddress: sessions.ipAddress,
      userAgent: sessions.userAgent,
      expiresAt: sessions.expiresAt,
    }));
  }
}
