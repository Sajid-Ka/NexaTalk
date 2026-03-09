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

@injectable()
export class SessionController {
  constructor(
    @inject(AUTH_TYPES.LogoutUser) private readonly _logoutUser: ILogoutUserUsecase,
    @inject(AUTH_TYPES.LogoutAllDevice) private readonly _logoutAllDevice: ILogoutAllDeviceUsecase,
    @inject(AUTH_TYPES.ListUserSessions) private readonly _listUserSessions: IListUserSessionsUsecase,
    @inject(AUTH_TYPES.RevokeSession) private readonly _revokeSession: IRevokeSessionUsecase,
    @inject(COMMON_TYPES.Logger) private readonly _logger : ILogger,
    @inject(AUTH_TYPES.RefreshCookieOptions) private readonly _cookieOptions : CookieOptions
  ) {}

  logout = async (req: AuthenticatedRequest, res: Response) => {
    const refreshToken = req.cookies?.refreshTokenV2;

    if (!refreshToken) {
      return res.status(200).json(successResponse(null, "Logged out"));
    }

    await this._logoutUser.execute(refreshToken);

    res.clearCookie("refreshTokenV2", this._cookieOptions);

    return res.status(200).json(successResponse(null, "Logged out successfully"));
  };

  logoutAll = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthorized");

    this._logger.warn("Logout all triggered", { userId: req.user.userId });

    await this._logoutAllDevice.execute(req.user.userId);

    return res.status(200).json(
      successResponse(null, "Logged out from all devices")
    );
  };

  sessions = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthorized");

    const result = await this._listUserSessions.execute(req.user.userId);

    return res.status(200).json(
      successResponse(result, "Active sessions fetched")
    );
  };

  revoke = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthorized");

    await this._revokeSession.execute(
      req.user.userId,
      req.params.sessionId
    );

    return res.status(200).json(
      successResponse(null, "Session revoked successfully")
    );
  };
}