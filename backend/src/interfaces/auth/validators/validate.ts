import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { ValidationError } from "../../../domain/errors/ValidationError";

export const validate = (schema: ZodObject<any>) => (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return next(new ValidationError());
    }
    req.body = result.data;
    next();
};
