import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../domain/core/errors/ValidationError";
import { ZodTypeAny } from "zod";
import { ValidationSource } from "../../shared/constants/validation.const";

export const validate =
  <T extends ZodTypeAny>(schema: T, source: ValidationSource = ValidationSource.BODY) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data = source === ValidationSource.QUERY ? req.query : req.body;

    const result = schema.safeParse(data);

    if (!result.success) {
      const details = result.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return next(new ValidationError("Invalid request data", details));
    }

    if (source === ValidationSource.QUERY) {
      Object.assign(req.query, result.data);
    } else {
      req.body = result.data;
    }

    next();
  };
