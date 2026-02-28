import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../../domain/errors/ValidationError";
import { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError());
    }
    req.body = result.data;
    next();
  };
