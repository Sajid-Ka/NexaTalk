import { Model } from "mongoose";

export interface QueryOptions {
    page?: number;
    limit?: number;
    search?: string;
    status?: "active" | "blocked" ;
    sort?: string;
}

export class MongoQueryBuilder<T> {
    constructor(private _model : Model<T>) {}

    async build(options : QueryOptions) {
        const page = options.page ?? 1;
        const limit = options.limit ?? 10;
        const skip = (page - 1) * limit;

        const filter : Record<string, unknown> = {deletedAt : null};

        if (options.search) {
            filter.$or = [
                { username: { $regex: options.search, $options: "i" } },
                { email: { $regex: options.search, $options: "i" } }
            ];
        }

        if (options.status === "blocked") {
            filter.isBlocked = true;
        }

        if (options.status === "active") {
            filter.isBlocked = false;
        }

        let sort : Record<string, 1 | -1> = {createdAt: -1};

        if(options.sort){
            const [field, order] = options.sort.split(":");

            const allowedSort = ["createdAt","username","email"];
            
            if(!allowedSort.includes(field)) {
                throw new Error("Invalid sort field");
            }

            sort = {[field] : order === "asc" ? 1 : -1};
        }

        const [docs, total] = await Promise.all([
            this._model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            this._model.countDocuments(filter)
        ]);

        return {docs, total, page, limit};
    }
}
