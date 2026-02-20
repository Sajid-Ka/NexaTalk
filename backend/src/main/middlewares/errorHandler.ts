import { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/errors/AppError";
import { logger } from "../../shared/logger/logger";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err.message);

  if(err instanceof ZodError){
    return res.status(400).json({
      message : "Validation failed",
      errors : err.issues.map((e) => ({
        field : e.path.join("."),
        message : e.message
      }))
    })
  }

  if (err instanceof AppError) {
    logger.warn(err.message);
    return res.status(err.statusCode).json({
      message : err.message
    });
  }

  return res.status(500).json({
    message : "Internal Server Error",
  })
};
