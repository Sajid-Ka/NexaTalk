import { Response, NextFunction } from "express";
import { container } from "../../../main/di/container";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ILogger } from "../../../domain/common/services/ILogger";
import { RequestWithId } from "../../../main/types/RequestWithId";
import { HttpHeader } from "../../../shared/constants/http-headers.const";

const logger = container.get<ILogger>(COMMON_TYPES.Logger);

export function requestLoggerInterceptor(req: RequestWithId, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info("HTTP Request", {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers[HttpHeader.USER_AGENT],
    });
  });

  next();
}
