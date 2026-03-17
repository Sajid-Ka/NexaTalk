import { ILogger } from "../../../domain/common/services/ILogger";

export class AuditLogger {
  static userAction(logger: ILogger, action: string, userId: string, metadata?: unknown) {
    logger.info("USER_ACTION", {
      action,
      userId,
      metadata,
    });
  }

  static adminAction(logger: ILogger, action: string, adminId: string, metadata?: unknown) {
    logger.warn("ADMIN_ACTION", {
      action,
      adminId,
      metadata,
    });
  }
}
