import { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/errors/AppError";
import { logger } from "../../infrastructure/common/logger/WinstonLogger";
import { errorResponse } from "../../shared/response/responseFormatter";
import { EmailNotVerifiedError } from "../../domain/auth/errors/EmailNotVerifiedError";


export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(`${err.code} - ${err.message}`);
    return res.status(err.statusCode).json(errorResponse(err.code, err.message));
  }

  if(err instanceof EmailNotVerifiedError) {
    return res.status(403).json({
      success : false,
      message : err.message,
    })
  }

  logger.error("Unexpected error", err);
  return res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "something went wrong"));
};
