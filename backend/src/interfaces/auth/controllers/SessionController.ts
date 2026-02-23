import { Response } from "express";
import { LogoutUser } from "../../../application/auth/usecases/LogoutUser";
import { LogoutAllDevice } from "../../../application/auth/usecases/LogoutAllDevice";
import { ListUserSessions } from "../../../application/auth/usecases/ListUserSessions";
import { RevokeSession } from "../../../application/auth/usecases/RevokeSession";
import { successResponse } from "../../../shared/response/responseFormatter";
import { UnauthorizedError } from "../../../domain/errors/UnauthorizedError";
import { AuthenticatedRequest } from "../../../main/types/AuthenticatedRequest";
import { logger } from "../../../shared/logger/logger";

export class SessionController {
  constructor(
    private logoutUser: LogoutUser,
    private logoutAllDevice: LogoutAllDevice,
    private listUserSessions: ListUserSessions,
    private revokeSession: RevokeSession
  ) {}

  logout = async (req: AuthenticatedRequest, res: Response) => {
    await this.logoutUser.execute(req.body.refreshToken);
    return res.status(200).json(successResponse(null, "Logged out successfully"));
  };

  logoutAll = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthorized");

    logger.warn("Logout all triggered", { userId: req.user.userId });

    await this.logoutAllDevice.execute(req.user.userId);

    return res.status(200).json(
      successResponse(null, "Logged out from all devices")
    );
  };

  sessions = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthorized");

    const result = await this.listUserSessions.execute(req.user.userId);

    return res.status(200).json(
      successResponse(result, "Active sessions fetched")
    );
  };

  revoke = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) throw new UnauthorizedError("Unauthorized");

    await this.revokeSession.execute(
      req.user.userId,
      req.params.sessionId
    );

    return res.status(200).json(
      successResponse(null, "Session revoked successfully")
    );
  };
}