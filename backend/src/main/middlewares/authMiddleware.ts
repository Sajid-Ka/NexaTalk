import { Response, NextFunction } from "express";
import { ITokenService } from "../../domain/features/auth/services/ITokenService";
import { UnauthorizedError } from "../../domain/core/errors/UnauthorizedError";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { IUserStatusService } from "../../domain/features/auth/services/IUserStatusService";

export const createAuthMiddleware =
  (tokenService: ITokenService, userStatusService: IUserStatusService) =>
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Access token missing"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new UnauthorizedError("Access token missing"));
    }

    try {
      const payload = await tokenService.verifyAccessToken(token);
      await userStatusService.validate(payload.userId, payload.sessionVersion);

      req.user = payload;
      next();
    } catch (error) {
      next(
        error instanceof UnauthorizedError
          ? error
          : new UnauthorizedError("Invalid or expired token"),
      );
    }
  };
