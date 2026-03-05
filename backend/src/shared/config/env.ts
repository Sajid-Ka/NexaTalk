import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

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

  REDIS_HOST : z.string().default("nexatalk-redis"),

  REDIS_PORT : z.coerce.number().default(6379),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;