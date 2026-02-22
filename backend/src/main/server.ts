import app from "./app";
import { env } from "../shared/config/env";
import { logger } from "../shared/logger/logger";
import { connectDB } from "../infrastructure/database/mongoConnection";

async function startServer() {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
}

startServer();
