import "reflect-metadata";
import app from "./app";
import { env } from "../shared/config/env";
import { logger } from "../infrastructure/common/logger/WinstonLogger";
import { connectDB } from "../infrastructure/common/database/mongoConnection";

async function startServer() {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

startServer();
