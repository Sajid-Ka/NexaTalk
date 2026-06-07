import { inject, injectable } from "inversify";
import { ITransferOwnershipUsecase } from "../interfaces/ITransferOwnershipUsecase";
import { SERVERS_TYPES } from "../../../../main/di/modules/servers/servers.types";
import { AUTH_TYPES } from "../../../../main/di/modules/auth/auth.types";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { IServerRepository } from "../../../../domain/features/servers/repositories/IServerRepository";
import { IServerAuditLogRepository } from "../../../../domain/features/servers/repositories/IServerAuditLogRepository";
import { IUserRepository } from "../../../../domain/features/auth/repositories/IUserRepository";
import { ServerAuditLog } from "../../../../domain/features/servers/entities/ServerAuditLog";
import { AuditLogAction } from "../../../../shared/constants/auditLog.const";

@injectable()
export class TransferOwnership implements ITransferOwnershipUsecase {
  constructor(
    @inject(SERVERS_TYPES.ServerMemberRepository)
    private readonly _memberRepository: IServerMemberRepository,
    @inject(SERVERS_TYPES.ServerRepository)
    private readonly _serverRepository: IServerRepository,
    @inject(SERVERS_TYPES.ServerAuditLogRepository)
    private readonly _auditLogRepo: IServerAuditLogRepository,
    @inject(AUTH_TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(serverId: string, currentOwnerId: string, newOwnerId: string): Promise<void> {
    const server = await this._serverRepository.findById(serverId);
    if (!server) throw new Error("Server not found");

    if (server.ownerId !== currentOwnerId)
      throw new Error("Only the current owner can transfer ownership");

    const newOwnerMember = await this._memberRepository.findByServerAndUser(serverId, newOwnerId);
    if (!newOwnerMember) throw new Error("New owner must be a member of the server");

    // Fetch the usernames for the audit log details!
    const currentOwner = await this._userRepository.findById(currentOwnerId);
    const newOwner = await this._userRepository.findById(newOwnerId);

    await this._memberRepository.transferOwnership(serverId, currentOwnerId, newOwnerId);
    await this._serverRepository.updateOwner(serverId, newOwnerId);

    await this._auditLogRepo.create(
      new ServerAuditLog({
        serverId,
        actorId: currentOwnerId,
        action: AuditLogAction.OWNERSHIP_TRANSFERRED,
        targetId: newOwnerId,
        metadata: {
          "Previous Owner": currentOwner?.username ?? "Unknown",
          "New Owner": newOwner?.username ?? "Unknown",
        },
      }),
    );
  }
}
