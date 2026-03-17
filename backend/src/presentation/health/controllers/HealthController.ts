import { Request, Response } from "express";
import mongoose from "mongoose";
import { redisClient } from "../../../infrastructure/common/cache/RedisClient";
import { injectable } from "inversify";
import { successResponse } from "../../../shared/response/responseFormatter";
import {
  ConnectionStatus,
  RedisConnectionState,
} from "../../../shared/constants/connection-status.const";
import { HealthMessage } from "../../../shared/constants/messages.const";

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
          status: HealthMessage.OK,
          mongo: mongoStatus,
          redis: redisStatus,
          uptime: process.uptime(),
          timeStamp: new Date().toISOString(),
        },
        HealthMessage.HEALTH_CHECK_SUCCESS,
      ),
    );
  }
}
