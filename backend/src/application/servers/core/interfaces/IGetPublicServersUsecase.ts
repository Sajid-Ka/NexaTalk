import { ServerResponse } from "../dtos/responses/ServerResponse";

import { PublicServerFilters } from "../../../../domain/features/servers/repositories/IServerRepository";

export interface IGetPublicServersUsecase {
  execute(
    limit?: number,
    offset?: number,
    filters?: PublicServerFilters,
  ): Promise<ServerResponse[]>;
}
