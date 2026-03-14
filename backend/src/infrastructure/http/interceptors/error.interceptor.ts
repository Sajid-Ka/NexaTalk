import { Response, NextFunction } from "express";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { container } from "../../../main/di/container";
import { AppError } from "../../../domain/errors/AppError";
import { errorResponse } from "../../../shared/response/responseFormatter";
import { RequestWithId } from "../../../main/types/RequestWithId";
import { InvalidRefreshTokenError } from "../../../domain/auth/errors/InvalidRefreshTokenError";
import { env } from "../../../shared/config/env";
import { CookieName, CookieSameSite } from "../../../shared/enums/cookie.enum";
import { NodeEnv } from "../../../shared/enums/environment.enum";

const logger = container.get<ILogger>(COMMON_TYPES.Logger);

export function errorInterceptor(
  err: unknown,
  req: RequestWithId,
  res: Response,
  _next: NextFunction,
) {
  logger.error("Unhandled Error", {
    requestId: req.requestId,
    path: req.originalUrl,
    error: err,
  });

  if (err instanceof AppError) {
    if (
      err instanceof InvalidRefreshTokenError &&
      req.originalUrl.startsWith("/api/auth/refresh")
    ) {
      res.clearCookie(CookieName.REFRESH_TOKEN, {
        httpOnly: true,
        sameSite: env.NODE_ENV === NodeEnv.PRODUCTION ? CookieSameSite.STRICT : CookieSameSite.LAX,
        secure: false,
        path: "/",
      });
    }

    return res.status(err.statusCode).json(errorResponse(err.code ?? err.name, err.message));
  }

  return res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "Internal server error"));
}
