import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../domain/errors/ValidationError";
import { ZodTypeAny } from "zod";

export const validate =
  <T extends ZodTypeAny>(schema: T, source : "body" | "query" = "body") =>
    (req: Request, _res: Response, next: NextFunction) => {

    const data = source === "query" ? req.query : req.body;

    const result = schema.safeParse(data);
    
    if (!result.success) {
      return next(new ValidationError());
    }
    
    if(source === "query") {
        Object.assign(req.query, result.data);
    } else {
        req.body = result.data
    }

    next();
  };
