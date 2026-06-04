import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerDirectInviteRepository } from "../../../../domain/features/servers/repositories/IServerDirectInviteRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IRespondToDirectInviteUsecase } from "../interfaces/IRespondToDirectInviteUsecase";
import { ServerMember } from "../../../../domain/features/servers/entities/ServerMember";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { NotFoundError } from "../../../../domain/core/errors/NotFoundError";
import { ForbiddenError } from "../../../../domain/core/errors/ForbiddenError";
import { BadRequestError } from "../../../../domain/core/errors/BadRequestError";

@injectable()
export class RespondToDirectInviteUsecase implements IRespondToDirectInviteUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerDirectInviteRepository)
    private readonly _directInviteRepo: IServerDirectInviteRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepo: IServerMemberRepository,
  ) {}

  async execute(
    inviteId: string,
    receiverId: string,
    status: "accepted" | "rejected",
  ): Promise<void> {
    const invite = await this._directInviteRepo.findById(inviteId);

    if (!invite) {
      throw new NotFoundError("Invite not found");
    }

    if (invite.receiverId !== receiverId) {
      throw new ForbiddenError("You are not allowed to respond to this invite");
    }

    if (invite.status !== "pending") {
      throw new BadRequestError("This invite has already been responded to", "INVITE_NOT_PENDING");
    }

    await this._directInviteRepo.updateStatus(inviteId, status);

    await this._directInviteRepo.rejectOtherPendingForServer(invite.serverId, receiverId, inviteId);

    if (status === "accepted") {
      const isMember = await this._memberRepo.isMember(invite.serverId, receiverId);

      if (!isMember) {
        const newMember = new ServerMember({
          serverId: invite.serverId,
          userId: receiverId,
          role: ServerMemberRole.MEMBER,
        });

        await this._memberRepo.create(newMember);
      }
    }
  }
}
