import mongoose, { ClientSession } from "mongoose";
import { injectable } from "inversify";
import { ITransactionManager } from "../../../domain/common/services/ITransactionManager";

@injectable()
export class MongoTransactionManager implements ITransactionManager {
  async run<T>(operation: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const result = await operation(session);

      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }
}
