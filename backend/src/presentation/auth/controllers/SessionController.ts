import { Response } from "express";
import { successResponse } from "../../../shared/response/responseFormatter";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ILogger } from "../../../domain/common/services/ILogger";
import { ILogoutUserUsecase } from "../../../application/auth/interfaces/ILogoutUserUsecase";
import { ILogoutAllDeviceUsecase } from "../../../application/auth/interfaces/ILogoutAllDeviceUsecase";
import { IListUserSessionsUsecase } from "../../../application/auth/interfaces/IListUserSessionsUsecase";
import { IRevokeSessionUsecase } from "../../../application/auth/interfaces/IRevokeSessionUsecase";
import { inject, injectable } from "inversify";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { CookieOptions } from "express";
import { CookieName } from "../../../shared/constants/cookie.const";
import { SessionMessage, ErrorMessage } from "../../../shared/constants/messages.const";

@injectable()
export class SessionController {
  constructor(
    @inject(AUTH_TYPES.LogoutUser) private readonly _logoutUser: ILogoutUserUsecase,
    @inject(AUTH_TYPES.LogoutAllDevice) private readonly _logoutAllDevice: ILogoutAllDeviceUsecase,
    @inject(AUTH_TYPES.ListUserSessions)
    private readonly _listUserSessions: IListUserSessionsUsecase,
    @inject(AUTH_TYPES.RevokeSession) private readonly _revokeSession: IRevokeSessionUsecase,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
    @inject(AUTH_TYPES.RefreshCookieOptions) private readonly _cookieOptions: CookieOptions,
  ) {}

  logout = async (req: AuthenticatedRequest, res: Response) => {
    const refreshToken = req.cookies?.refreshTokenV2;

    if (!refreshToken) {
      return res.status(200).json(successResponse(null, SessionMessage.LOGGED_OUT));
    }

    await this._logoutUser.execute(refreshToken);

    res.clearCookie(CookieName.REFRESH_TOKEN, this._cookieOptions);

    return res.status(200).json(successResponse(null, SessionMessage.LOGGED_OUT_SUCCESS));
  };

  logoutAll = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError(ErrorMessage.UNAUTHORIZED);

    this._logger.warn("Logout all triggered", { userId: req.user.userId });

    await this._logoutAllDevice.execute(req.user.userId);

    return res.status(200).json(successResponse(null, SessionMessage.LOGGED_OUT_ALL));
  };

  sessions = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError(ErrorMessage.UNAUTHORIZED);

    const result = await this._listUserSessions.execute(req.user.userId);

    return res.status(200).json(successResponse(result, SessionMessage.SESSIONS_FETCHED));
  };

  revoke = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError(ErrorMessage.UNAUTHORIZED);

    await this._revokeSession.execute(req.user.userId, req.params.sessionId);

    return res.status(200).json(successResponse(null, SessionMessage.SESSION_REVOKED));
  };
}
