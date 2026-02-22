import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const requestIdMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    (req as any).requestId = randomUUID();
    next();
};
