import { IUserRepository } from "../../../domain/auth/interfaces/IUserRepository";
import { User } from "../../../domain/auth/entities/User";
import { UserModel } from "../database/UserModel";

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });

    if (!userDoc) return null;

    return new User({
      id: userDoc.id,
      username: userDoc.username,
      email: userDoc.email,
      passwordHash: userDoc.passwordHash,
      globalRole : userDoc.globalRole
    });
  }

  async create(data: {
    username: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const created = await UserModel.create(data);

    return new User({
      id: created._id.toString(),
      username: created.username,
      email: created.email,
      passwordHash: created.passwordHash,
      globalRole : created.globalRole,
    });
  }
}
