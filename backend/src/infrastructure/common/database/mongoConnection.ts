import mongoose from "mongoose";
import { env } from "../../../shared/config/env";
import { ILogger } from "../../../domain/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";
import { container } from "../../../main/di/container";

const logger = container.get<ILogger>(COMMON_TYPES.Logger);

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch {
    logger.error("Mongodb connection failed");
    process.exit(1);
  }
};
