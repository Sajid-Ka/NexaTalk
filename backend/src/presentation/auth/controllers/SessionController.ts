import { Response } from "express";
import { successResponse } from "../../../shared/response/responseFormatter";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { logger } from "../../../infrastructure/common/logger/WinstonLogger";
import { ILogoutUserUsecase } from "../../../application/auth/interfaces/ILogoutUserUsecase";
import { ILogoutAllDeviceUsecase } from "../../../application/auth/interfaces/ILogoutAllDeviceUsecase";
import { IListUserSessionUsecase } from "../../../application/auth/interfaces/IListUserSessionsUsecase";
import { IRevokeSessionUsecase } from "../../../application/auth/interfaces/IRevokeSessionUsecase";
import { env } from "../../../shared/config/env";

export class SessionController {
  constructor(
    private readonly _logoutUser: ILogoutUserUsecase,
    private readonly _logoutAllDevice: ILogoutAllDeviceUsecase,
    private readonly _listUserSessions: IListUserSessionUsecase,
    private readonly _revokeSession: IRevokeSessionUsecase
  ) {}

  logout = async (req: AuthenticatedRequest, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken) {
      return res.status(200).json(successResponse(null,"Logged out"));
    }

    await this._logoutUser.execute(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly : true,
      secure : env.NODE_ENV === "production",
      sameSite : "strict",
      path : "/api/auth/refresh",
    });

    return res.status(200).json(successResponse(null, "Logged out successfully"));
  };

  logoutAll = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthorized");

    logger.warn("Logout all triggered", { userId: req.user.userId });

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