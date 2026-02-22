import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../../domain/errors/ForbiddenError";

export const requireRole = (...allowedRoles: string[]) => (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (!(req as any).user) {
        return next(new ForbiddenError("Unauthorized access"));
    }

    if (!allowedRoles.includes((req as any).user.role)) {
        return next(new ForbiddenError("Insufficient Permissions"));
    }

    next();
};
