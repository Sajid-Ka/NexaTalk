import { IRefreshTokenRepository } from "../../../domain/auth/repositories/IRefreshTokenRepository";
import { SessionListResponse } from "../dtos/responses/SessionListResponse";
import { IListUserSessionsUsecase } from "../interfaces/IListUserSessionsUsecase";
import { injectable,inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";

@injectable()
export class ListUserSessions implements IListUserSessionsUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository) private _refreshRepo: IRefreshTokenRepository
  ) {}

  async execute(userId: string): Promise<SessionListResponse[]> {
    const sessions = await this._refreshRepo.findActiveByUser(userId);

    return sessions.map((sessions) => ({
        id: sessions.id!,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        expiresAt: sessions.expiresAt,
    }));
  }
}
