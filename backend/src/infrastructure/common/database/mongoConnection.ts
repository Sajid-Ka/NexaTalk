import mongoose from "mongoose";
import { env } from "../../../shared/config/env";
import { logger } from "../logger/logger";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch {
    logger.error("Mongodb connection failed");
    process.exit(1);
  }
};
