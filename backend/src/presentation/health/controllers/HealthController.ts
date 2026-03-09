import { Request, Response } from "express";
import mongoose from "mongoose";
import { redisClient } from "../../../infrastructure/common/cache/RedisClient";
import { injectable } from "inversify";
import { successResponse } from "../../../shared/response/responseFormatter";


@injectable()
export class HealthController {
    async check(_req : Request, res : Response) {
        const mongoStatus = 
            mongoose.connection.readyState === 1 ? "connected" : "disconnected";

        const redisStatus =
            redisClient.status === "ready" ? "connected" : "disconnected"

        return res.status(200).json(
            successResponse(
                {
                    status : "ok",
                    mongo : mongoStatus,
                    redis : redisStatus,
                    uptime : process.uptime(),
                    timeStamp : new Date().toISOString(),
                },
                "Health check successful"
            )
        )
    }
}