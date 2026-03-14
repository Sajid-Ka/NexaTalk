import { Request, Response } from "express";
import mongoose from "mongoose";
import { redisClient } from "../../../infrastructure/common/cache/RedisClient";
import { injectable } from "inversify";
import { successResponse } from "../../../shared/response/responseFormatter";
import {
  ConnectionStatus,
  RedisConnectionState,
} from "../../../shared/enums/connection-status.enum";

@injectable()
export class HealthController {
  async check(_req: Request, res: Response) {
    const mongoStatus =
      mongoose.connection.readyState === 1
        ? ConnectionStatus.CONNECTED
        : ConnectionStatus.DISCONNECTED;

    const redisStatus =
      redisClient.status === RedisConnectionState.READY
        ? ConnectionStatus.CONNECTED
        : ConnectionStatus.DISCONNECTED;

    return res.status(200).json(
      successResponse(
        {
          status: "ok",
          mongo: mongoStatus,
          redis: redisStatus,
          uptime: process.uptime(),
          timeStamp: new Date().toISOString(),
        },
        "Health check successful",
      ),
    );
  }
}
