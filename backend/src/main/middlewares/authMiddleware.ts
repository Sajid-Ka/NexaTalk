import { Response, NextFunction } from "express";
import { JwtTokenService } from "../../infrastructure/auth/services/JwtTokenService";
import { UnauthorizedError } from "../../domain/errors/UnauthorizedError";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const tokenService = new JwtTokenService();

export const authMiddleware = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new UnauthorizedError("Access token missing"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
