import { Request, Response, NextFunction } from "express";

export function responseInterceptor(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json;

  res.json = function (data: unknown) {
    return originalJson.call(this, {
      success: true,
      data,
    });
  };

  next();
}