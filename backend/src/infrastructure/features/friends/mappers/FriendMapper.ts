import { Friend } from "../../../../domain/features/friends/entities/Friend";
import { IFriendPersistence } from "../database/FriendModel";
import { IMapper } from "../../../core/common/mappers/IMapper";
import { OmittedDatabaseFields } from "../../../../shared/constants/database-field.const";

export class FriendPersistenceMapper implements IMapper<IFriendPersistence, Friend> {
  toDomain(doc: IFriendPersistence): Friend {
    return new Friend({
      id: doc._id.toString(),
      userId: doc.userId,
      friendId: doc.friendId,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  toPersistence(entity: Friend): Omit<IFriendPersistence, OmittedDatabaseFields> {
    return {
      userId: entity.userId,
      friendId: entity.friendId,
      status: entity.status,
    };
  }

  toPersistenceUpdate(partialDomain: Partial<Friend>): Record<string, unknown> {
    const update: Record<string, unknown> = {};
    if (partialDomain.status !== undefined) update.status = partialDomain.status;
    return update;
  }
}
