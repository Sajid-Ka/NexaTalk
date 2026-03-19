import "reflect-metadata";
import app from "./app";
import { env } from "../shared/config/env";
import { ILogger } from "../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "./di/modules/common/common.types";
import { container } from "./di/container";
import { connectDB } from "../infrastructure/core/common/database/mongoConnection";
import { setupGracefulShutdown } from "./utils/gracefulShutdown";

const logger = container.get<ILogger>(COMMON_TYPES.Logger);

async function startServer() {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });

  setupGracefulShutdown(server);
}

startServer();
