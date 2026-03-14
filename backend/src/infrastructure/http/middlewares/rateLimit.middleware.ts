import { Request, Response, NextFunction } from "express";
import { container } from "../../../main/di/container";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { ICacheService } from "../../../domain/common/services/ICacheService";
import { errorResponse } from "../../../shared/response/responseFormatter";

export function rateLimit(prefix: string, limit: number, windowSecond: number) {
  const cache = container.get<ICacheService>(COMMON_TYPES.CacheService);

  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const key = `${prefix}:${ip}`;

    const count = await cache.increment(key);

    if (count === 1) {
      await cache.expire(key, windowSecond);
    }

    if (count > limit) {
      return res
        .status(429)
        .json(errorResponse("Too many requests. please try again later.", "RATE_LIMIT_EXEED"));
    }

    next();
  };
}
