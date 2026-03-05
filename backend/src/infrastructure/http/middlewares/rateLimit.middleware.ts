import { Request,Response,NextFunction } from "express";
import { container } from "../../../main/di/container";
import { AUTH_TYPES } from "../../../main/di/modules/auth/auth.types";
import { ICacheService } from "../../../domain/common/service/ICacheService";

export function rateLimit(
    prefix : string,
    limit : number,
    windowSecond : number,
) {

    const cache = container.get<ICacheService>(AUTH_TYPES.CacheService);

    return async (req : Request, res : Response, next : NextFunction) => {
        const ip = req.ip;

        const key = `${prefix}:${ip}`;

        const count = await cache.increment(key);

        if(count === 1) {
            await cache.expire(key,windowSecond);
        }

        if(count > limit){
            return res.status(429).json({
                success:false,
                message : "Too many requests. please try again later.",
            });
        }

        next();
    }
}