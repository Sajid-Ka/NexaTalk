import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerDirectInviteRepository } from "../../../../domain/features/servers/repositories/IServerDirectInviteRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { ServerDirectInvite } from "../../../../domain/features/servers/entities/ServerDirectInvite";
import { ISendDirectServerInviteUsecase } from "../interfaces/ISendDirectServerInviteUsecase";
import { ConflictError } from "../../../../domain/features/auth/errors/ConflictError";
import { BadRequestError } from "../../../../domain/core/errors/BadRequestError";

@injectable()
export class SendDirectServerInviteUsecase implements ISendDirectServerInviteUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerDirectInviteRepository)
    private readonly _directInviteRepo: IServerDirectInviteRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
  ) {}

  async execute(
    serverId: string,
    senderId: string,
    receiverId: string,
  ): Promise<ServerDirectInvite> {
    const isMember = await this._memberRepo.isMember(serverId, receiverId);

    if (isMember) {
      throw new BadRequestError("This user is already a member of the server.", "ALREADY_MEMBER");
    }

    const existingInvite = await this._directInviteRepo.findPendingByServerAndReceiver(
      serverId,
      receiverId,
    );

    if (existingInvite) {
      throw new ConflictError(
        "DIRECT_INVITE_ALREADY_PENDING",
        "An invite to this server is already pending for this user.",
      );
    }

    return this._directInviteRepo.create({
      serverId,
      senderId,
      receiverId,
      status: "pending",
    });
  }
}
