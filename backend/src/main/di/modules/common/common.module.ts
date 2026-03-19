import { Container } from "inversify";
import { COMMON_TYPES } from "../common/common.types";
import { RedisCacheService } from "../../../../infrastructure/core/common/cache/RedisCacheService";
import { WinstonLogger } from "../../../../infrastructure/core/common/logger/WinstonLogger";
import { MongoTransactionManager } from "../../../../infrastructure/core/common/database/MongoTransactionManager";

export function loadCommonModule(container: Container) {
  container.bind(COMMON_TYPES.Logger).to(WinstonLogger).inSingletonScope();

  container.bind(COMMON_TYPES.CacheService).to(RedisCacheService).inSingletonScope();

  container.bind(COMMON_TYPES.TransactionManager).to(MongoTransactionManager).inSingletonScope();
}
