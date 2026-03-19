import mongoose from "mongoose";
import { redisClient } from "../../infrastructure/core/common/cache/RedisClient";
import { ILogger } from "../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../di/modules/common/common.types";
import { container } from "../di/container";
import { Server } from "http";

const logger = container.get<ILogger>(COMMON_TYPES.Logger);

export function setupGracefulShutdown(server: Server) {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown`);

    try {
      logger.info("Stopping HTTP server...");

      server.close(() => {
        logger.info("HTTP server closed");
      });

      await mongoose.connection.close();
      logger.info("Mongo connection closed");

      if (redisClient.status === "ready") {
        await redisClient.quit();
        logger.info("Redis connection closed");
      }

      setTimeout(() => {
        logger.error("Force shutdown after timeout");
        process.exit(1);
      }, 10000);

      process.exit(0);
    } catch (error) {
      logger.error("Graceful shutdown failed", error);
      process.exit(1);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
