import { Response, NextFunction } from "express";
import { ILogger } from "../../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../../main/di/modules/common/common.types";
import { container } from "../../../../main/di/container";
import { AppError } from "../../../../domain/core/errors/AppError";
import { errorResponse } from "../../../../shared/response/responseFormatter";
import { RequestWithId } from "../../../../main/types/RequestWithId";
import { InvalidRefreshTokenError } from "../../../../domain/features/auth/errors/InvalidRefreshTokenError";
import { env } from "../../../../shared/config/env";
import { CookieName, CookieSameSite } from "../../../../shared/constants/cookie.const";
import { NodeEnv } from "../../../../shared/constants/environment.const";
import { ErrorMessage } from "../../../../shared/constants/messages.const";

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

    error:
      err instanceof Error
        ? {
            name: err.name,
            message: err.message,
            stack: err.stack,
          }
        : err,
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

    let details: unknown = undefined;
    if (err && typeof err === "object" && "details" in err) {
      details = (err as { details?: unknown }).details;
    }

    return res
      .status(err.statusCode)
      .json(errorResponse(err.code ?? err.name, err.message, details));
  }

  return res
    .status(500)
    .json(errorResponse("INTERNAL_SERVER_ERROR", ErrorMessage.INTERNAL_SERVER_ERROR));
}
