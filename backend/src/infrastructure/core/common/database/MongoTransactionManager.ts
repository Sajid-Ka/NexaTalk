import mongoose from "mongoose";
import { injectable } from "inversify";
import { ITransactionManager } from "../../../../domain/core/common/services/ITransactionManager";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";

@injectable()
export class MongoTransactionManager implements ITransactionManager {
  async run<T>(operation: (transaction: TransactionContext) => Promise<T>): Promise<T> {
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
