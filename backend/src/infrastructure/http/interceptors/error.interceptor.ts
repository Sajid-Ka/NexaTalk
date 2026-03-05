import { Request,Response,NextFunction } from "express";
import { logger } from "../../common/logger/logger";
import { success } from "zod";

export function errorInterceptor (
    err : unknown,
    req : Request,
    res : Response,
    next : NextFunction,
) {
    logger.error("Unhandle Error", {
        path : req.originalUrl,
        error : err,
    });

    if(err instanceof Error) {
        return res.status(400).json({
            success : false,
            message : err.message,
        });
    }

    res.status(500).json({
        success : false,
        message : "Internal server error",
    });
}