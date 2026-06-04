import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerDirectInviteRepository } from "../../../../domain/features/servers/repositories/IServerDirectInviteRepository";
import { IGetPendingDirectInvitesUsecase } from "../interfaces/IGetPendingDirectInvitesUsecase";
import { PendingDirectInviteResponse } from "../dtos/responses/PendingDirectInviteResponse";

@injectable()
export class GetPendingDirectInvitesUsecase implements IGetPendingDirectInvitesUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerDirectInviteRepository)
    private readonly _directInviteRepo: IServerDirectInviteRepository,
  ) {}

  async execute(receiverId: string): Promise<PendingDirectInviteResponse[]> {
    const invites = await this._directInviteRepo.findPendingByReceiver(receiverId);
    const uniqueInvites = new Map<string, PendingDirectInviteResponse>();

    for (const invite of invites) {
      const key = `${invite.serverId._id}:${invite.senderId._id}`;

      if (!uniqueInvites.has(key)) {
        uniqueInvites.set(key, invite);
      }
    }

    return Array.from(uniqueInvites.values());
  }
}
