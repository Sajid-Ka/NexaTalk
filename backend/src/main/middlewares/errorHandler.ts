import { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/errors/AppError";
import { logger } from "../../infrastructure/common/logger/WinstonLogger";
import { errorResponse } from "../../shared/response/responseFormatter";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(`${err.code} - ${err.message}`);
    return res.status(err.statusCode).json(errorResponse(err.code, err.message));
  }

  logger.error("Unexpected error", err);
  return res.status(500).json(errorResponse("INTERNAL_SERVER_ERROR", "something went wrong"));
};
