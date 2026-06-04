import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerDirectInviteRepository } from "../../../../domain/features/servers/repositories/IServerDirectInviteRepository";
import { IGetSentDirectInvitesUsecase } from "../interfaces/IGetSentDirectInvitesUsecase";
import { ServerDirectInvite } from "../../../../domain/features/servers/entities/ServerDirectInvite";

@injectable()
export class GetSentDirectInvitesUsecase implements IGetSentDirectInvitesUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerDirectInviteRepository)
    private readonly _directInviteRepo: IServerDirectInviteRepository,
  ) {}

  async execute(serverId: string, senderId: string): Promise<ServerDirectInvite[]> {
    return this._directInviteRepo.findPendingByServerAndSender(serverId, senderId);
  }
}
