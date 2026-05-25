import { inject, injectable } from "inversify";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { ServerNotFoundError } from "../../../../domain/features/servers/errors/ServerNotFoundError";
import { NotMemberError } from "../../../../domain/features/servers/errors/NotMemberError";
import { CannotRemoveOwnerError } from "../../../../domain/features/servers/errors/CannotRemoveOwnerError";
import { InsufficientPermissionsError } from "../../../../domain/features/servers/errors/InsufficientPermissionsError";
import { ServerMemberRole } from "../../../../shared/constants/server.const";
import { IUpdateMemberRoleUsecase } from "../interfaces/IUpdateMemberRoleUsecase";
import { UpdateMemberRoleRequest } from "../dtos/requests/UpdateMemberRoleRequest";

@injectable() 
export class UpdateMemberRole implements IUpdateMemberRoleUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerRepository) private readonly _serverRepo: IServerRepository,
    @inject(SERVERS_TYPES.ServerMemberRepository) private readonly _memberRepo: IServerMemberRepository,
  ) {}

  async execute(
    serverId: string,
    currentUserId: string,
    targetUserId: string,
    request: UpdateMemberRoleRequest,
  ): Promise<void> {
    const server = await this._serverRepo.findById(serverId);

    if (!server) {
      throw new ServerNotFoundError();
    }

    const currentMember =
      await this._memberRepo.findByServerAndUser(
        serverId,
        currentUserId,
      );

    if (!currentMember) {
      throw new NotMemberError();
    }

    if (
      currentMember.role !== ServerMemberRole.OWNER
    ) {
      throw new InsufficientPermissionsError();
    }

    const targetMember =
      await this._memberRepo.findByServerAndUser(
        serverId,
        targetUserId,
      );

    if (!targetMember) {
      throw new NotMemberError();
    }

    if (
      targetMember.role === ServerMemberRole.OWNER
    ) {
      throw new CannotRemoveOwnerError();
    }

    await this._memberRepo.updateRole(
      serverId,
      targetUserId,
      request.role,
    );
  }
}