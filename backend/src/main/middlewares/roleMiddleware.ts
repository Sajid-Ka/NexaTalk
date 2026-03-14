import { Response, NextFunction } from "express";
import { ForbiddenError } from "../../domain/errors/ForbiddenError";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { GlobalRole } from "../../shared/constants/userRole.const";
import { ErrorMessage } from "../../shared/constants/messages.const";

export const requireRole =
  (...allowedRoles: GlobalRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError(ErrorMessage.UNAUTHORIZED_ACCESS));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(ErrorMessage.INSUFFICIENT_PERMISSIONS));
    }

    next();
  };
