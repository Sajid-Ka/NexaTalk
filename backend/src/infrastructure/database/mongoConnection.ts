import mongoose from "mongoose";
import { env } from "../../shared/config/env";
import { logger } from "../../shared/logger/logger";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("Mongodb connection failed");
    process.exit(1);
  }
};
