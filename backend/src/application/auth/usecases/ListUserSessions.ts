import { IRefreshTokenRepository } from "../../../domain/features/auth/repositories/IRefreshTokenRepository";
import { SessionListResponse } from "../dtos/responses/SessionListResponse";
import { IListUserSessionsUsecase } from "../interfaces/IListUserSessionsUsecase";
import { injectable, inject } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class ListUserSessions implements IListUserSessionsUsecase {
  constructor(
    @inject(AUTH_TYPES.RefreshTokenRepository)
    private readonly _refreshRepo: IRefreshTokenRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(userId: string): Promise<SessionListResponse[]> {
    this._logger.info("Listing sessions", { userId });

    const sessions = await this._refreshRepo.findActiveByUser(userId);

    return sessions.map((session) => ({
      id: session.id!,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
    }));
  }
}
