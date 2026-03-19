import { injectable } from "inversify";
import { redisClient } from "./RedisClient";
import { ICacheService } from "../../../../domain/core/common/services/ICacheService";

@injectable()
export class RedisCacheService implements ICacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redisClient.get(key);
    if (!value) return null;

    return JSON.parse(value);
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    if (ttlSeconds) {
      await redisClient.set(key, serialized, "EX", ttlSeconds);
    } else {
      await redisClient.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await redisClient.exists(key);
    return result === 1;
  }

  async increment(key: string): Promise<number> {
    return await redisClient.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await redisClient.expire(key, seconds);
  }
}
