import { injectable } from "inversify";
import { ServerMember } from "../../../../domain/features/servers/entities/ServerMember";
import { IServerMemberRepository } from "../../../../domain/features/servers/repositories/IServerMemberRepository";
import { BaseRepository } from "../../../core/common/database/BaseRepository";
import { ServerMemberModel, IServerMemberPersistence } from "../database/ServerMemberModel";
import { ServerMemberPersistenceMapper } from "../mappers/ServerMemberMapper";
import { ServerMemberRole } from "../../../../shared/constants/server.const";

@injectable()
export class ServerMemberRepository
  extends BaseRepository<IServerMemberPersistence, ServerMember>
  implements IServerMemberRepository
{
  constructor() {
    super(ServerMemberModel, new ServerMemberPersistenceMapper());
  }

  async findByServer(serverId: string): Promise<ServerMember[]> {
    const docs = await this.model.find({ serverId }).sort({ joinedAt: 1 }).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findByUser(userId: string): Promise<ServerMember[]> {
    const docs = await this.model.find({ userId }).sort({ joinedAt: -1 }).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findByServerAndUser(serverId: string, userId: string): Promise<ServerMember | null> {
    const doc = await this.model.findOne({ serverId, userId }).lean();
    return doc ? this.mapper.toDomain(doc) : null;
  }

  async updateRole(
    serverId: string,
    userId: string,
    role: ServerMemberRole,
  ): Promise<ServerMember> {
    const updated = await this.model.findOneAndUpdate(
      { serverId, userId },
      { $set: { role, updatedAt: new Date() } },
      { new: true, lean: true },
    );
    if (!updated) {
      throw new Error("Member not found");
    }
    return this.mapper.toDomain(updated);
  }

  async isMember(serverId: string, userId: string): Promise<boolean> {
    const count = await this.model.countDocuments({ serverId, userId });
    return count > 0;
  }

  async getMemberCount(serverId: string): Promise<number> {
    return this.model.countDocuments({ serverId });
  }

  async getMembersWithRole(serverId: string, role: ServerMemberRole): Promise<ServerMember[]> {
    const docs = await this.model.find({ serverId, role }).lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async getAdmins(serverId: string): Promise<ServerMember[]> {
    const docs = await this.model
      .find({
        serverId,
        role: { $in: [ServerMemberRole.ADMIN, ServerMemberRole.OWNER] },
      })
      .lean();
    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async transferOwnership(
    serverId: string,
    currentOwnerId: string,
    newOwnerId: string,
  ): Promise<void> {
    const session = await this.model.startSession();
    try {
      session.startTransaction();

      // Demote current owner to admin
      await this.model.updateOne(
        { serverId, userId: currentOwnerId },
        { $set: { role: ServerMemberRole.ADMIN } },
        { session },
      );

      // Promote new owner
      await this.model.updateOne(
        { serverId, userId: newOwnerId },
        { $set: { role: ServerMemberRole.OWNER } },
        { session },
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
