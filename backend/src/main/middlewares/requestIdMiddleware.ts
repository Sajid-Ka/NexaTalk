import { Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const requestIdMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  req.requestId = randomUUID();
  next();
};
