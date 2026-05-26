import { ClientSession } from "mongoose";
import { TransactionContext } from "../../../../domain/core/common/services/TransactionContext";

export const toMongoSession = (transaction?: TransactionContext): ClientSession | undefined => {
  return transaction as ClientSession | undefined;
};
