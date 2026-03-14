import { Response, NextFunction } from "express";
import { ITokenService } from "../../domain/auth/services/ITokenService";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const createAuthMiddleware =
  (tokenService: ITokenService) =>
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
      req.user = await tokenService.verifyAccessToken(token);
      next();
    } catch {
      next(new UnauthorizedError("Invalid or expired token"));
    }
  };
