import { inject, injectable } from "inversify";
import { ITransferOwnershipUsecase } from "../interfaces/ITransferOwnershipUsecase";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";

@injectable()
export class TransferOwnership implements ITransferOwnershipUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepository: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerRepository)
    private readonly _serverRepository: IServerRepository,
  ) {}

  async execute(serverId: string, currentOwnerId: string, newOwnerId: string): Promise<void> {
    const server = await this._serverRepository.findById(serverId);
    if (!server) {
      throw new Error("Server not found");
    }

    if (server.ownerId !== currentOwnerId) {
      throw new Error("Only the current owner can transfer ownership");
    }

    const newOwnerMember = await this._memberRepository.findByServerAndUser(serverId, newOwnerId);
    if (!newOwnerMember) {
      throw new Error("New owner must be a member of the server");
    }

    await this._memberRepository.transferOwnership(serverId, currentOwnerId, newOwnerId);
    await this._serverRepository.updateOwner(serverId, newOwnerId);
  }
}
