import { inject, injectable } from "inversify";
import { ADMIN_TYPES } from "../../../../main/di/modules/admin/admin.types";
import { IAdminServerRepository } from "../../../../domain/features/admin/repositories/IAdminServerRepository";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { IDisableServerUsecase } from "../interfaces/IDisableServerUsecase";

@injectable()
export class DisableServer implements IDisableServerUsecase {
  constructor(
    @inject(ADMIN_TYPES.AdminServerRepository)
    private readonly _serverRepo: IAdminServerRepository,
  ) {}

  async execute(serverId: string): Promise<void> {
    const server = await this._serverRepo.findServerById(serverId);

    if (!server) {
      throw new NotFoundError("Server not found");
    }

    await this._serverRepo.disableServer(serverId);
  }
}