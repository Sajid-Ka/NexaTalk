import winston from "winston";
import { env } from "../../../shared/config/env";
import { ILogger } from "../../../domain/common/services/ILogger";
import { injectable } from "inversify";
import { LogLevel } from "../../../shared/enums/log-level.enum";
import { NodeEnv } from "../../../shared/enums/environment.enum";

@injectable()
export class WinstonLogger implements ILogger {
  private logger = winston.createLogger({
    level: env.NODE_ENV === NodeEnv.PRODUCTION ? LogLevel.INFO : LogLevel.DEBUG,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
    ),
    transports: [new winston.transports.Console()],
  });

  info(message: string, meta?: unknown): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: unknown): void {
    this.logger.error(message, meta);
  }

  debug(message: string, meta?: unknown): void {
    this.logger.debug(message, meta);
  }
}
