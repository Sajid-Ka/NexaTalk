import winston from "winston";
import { env } from "../../../shared/config/env";
import { ILogger } from "../../../domain/common/service/ILogger";
import { injectable } from "inversify";


export const logger: ILogger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});
