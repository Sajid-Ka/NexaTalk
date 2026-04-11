import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../domain/features/servers/repositories/IServerRepository";
import { IGetPublicServersUsecase } from "../interfaces/IGetPublicServersUsecase";
import { ServerResponse } from "../dtos/responses/ServerResponse";
import { ServerMapper } from "../mappers/ServerMapper";
import { ILogger } from "../../../domain/core/common/services/ILogger";
import { COMMON_TYPES } from "../../../main/di/modules/common/common.types";

@injectable()
export class GetPublicServers implements IGetPublicServersUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(COMMON_TYPES.Logger) private readonly _logger: ILogger,
  ) {}

  async execute(limit: number = 20, offset: number = 0): Promise<ServerResponse[]> {
    this._logger.info("Getting public servers", { limit, offset });

    const servers = await this._serverRepo.findPublicServers(limit, offset);

    return ServerMapper.toResponseList(servers);
  }
}
