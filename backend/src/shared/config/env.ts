import { z } from "zod";
import dotenv from "dotenv";
import { container } from "../../main/di/container";
import { COMMON_TYPES } from "../../main/di/modules/common/common.types";
import { ILogger } from "../../domain/common/services/ILogger";
import { NodeEnv } from "../constants/environment.const";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(Object.values(NodeEnv) as [string, ...string[]]).default(NodeEnv.DEVELOPMENT),

  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z.string().url(),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_REFRESH_SECRET: z
    .string()
    .trim()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

  JWT_ACCESS_TTL: z.string().default("15m"),

  CLIENT_ORIGIN: z.string().trim().url(),

  EMAIL_USER: z.string().trim().email(),
  EMAIL_PASS: z.string().trim().min(1),

  APP_BASE_URL: z.string().trim().url(),

  REDIS_HOST: z.string().default("nexatalk-redis"),
  REDIS_PORT: z.coerce.number().default(6379),

  EMAIL_VERIFY_TTL_MINUTES: z.coerce.number().default(15),
  RESET_PASSWORD_TTL_MINUTES: z.coerce.number().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),
  REFRESH_COOKIE_MAX_AGE_MS: z.coerce.number().default(604800000),

  RATE_LIMIT_LOGIN: z.coerce.number().default(5),
  RATE_LIMIT_SIGNUP: z.coerce.number().default(3),
  RATE_LIMIT_RESET: z.coerce.number().default(3),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(60),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Use logger if available, otherwise console as fallback
  try {
    const logger = container.get<ILogger>(COMMON_TYPES.Logger);
    logger.error("Invalid environment variables", parsed.error.format());
  } catch {
    console.error("Invalid environment variables");
    console.error(parsed.error.format());
  }
  process.exit(1);
}

export const env = parsed.data;
