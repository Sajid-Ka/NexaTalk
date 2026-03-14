import { Response, NextFunction } from "express";
import { ForbiddenError } from "../../domain/errors/ForbiddenError";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { GlobalRole } from "../../shared/enums/userRole.enum";

export const requireRole =
  (...allowedRoles: GlobalRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError("Unauthorized access"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError("Insufficient Permissions"));
    }

    next();
  };
