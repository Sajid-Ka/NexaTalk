import { Model } from "mongoose";
import { UserAccountStatus } from "../../../shared/constants/authStatus.const";
import { GlobalRole } from "../../../shared/constants/userRole.const";
import { SortField, SortOrder, sortOrderToMongo } from "../../../shared/constants/sort.const";

export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserAccountStatus;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  role?: GlobalRole;
  dateFrom?: Date;
  dateTo?: Date;
}

export class MongoQueryBuilder<T> {
  constructor(private _model: Model<T>) {}

  async build(options: QueryOptions) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { deletedAt: null };

    if (options.search) {
      filter.$or = [
        { username: { $regex: options.search, $options: "i" } },
        { email: { $regex: options.search, $options: "i" } },
      ];
    }

    if (options.status) {
      if (options.status === UserAccountStatus.BLOCKED) {
        filter.isBlocked = true;
      } else if (options.status === UserAccountStatus.ACTIVE) {
        filter.isBlocked = false;
      } else if (options.status === UserAccountStatus.DELETED) {
        filter.deletedAt = { $ne: null };
      }
    }

    if (options.role) {
      filter.globalRole = options.role;
    }

    if (options.dateFrom || options.dateTo) {
      filter.createdAt = {};
      if (options.dateFrom) (filter.createdAt as { $gte?: Date }).$gte = options.dateFrom;
      if (options.dateTo) (filter.createdAt as { $lte?: Date }).$lte = options.dateTo;
    }

    let sort: Record<string, 1 | -1> = { createdAt: -1 };

    if (options.sortBy) {
      const sortField = options.sortBy === SortField.STATUS ? "isBlocked" : options.sortBy;
      const mongoOrder = sortOrderToMongo(options.sortOrder) ?? -1;
      sort = { [sortField]: mongoOrder };
    }

    const [docs, total] = await Promise.all([
      this._model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      this._model.countDocuments(filter),
    ]);

    return { docs, total, page, limit };
  }
}
