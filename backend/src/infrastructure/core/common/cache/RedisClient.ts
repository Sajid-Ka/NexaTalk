import Redis from "ioredis";
import { env } from "../../../../shared/config/env";

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: env.REDIS_MAX_RETRIES_PER_REQUEST,
  enableReadyCheck: true,
});
