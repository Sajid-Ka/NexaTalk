import { injectable } from "inversify";
import { Interest } from "../../../domain/interests/entities/Interest";
import { IInterestRepository } from "../../../domain/interests/repositories/IInterestRepository";
import { BaseRepository } from "../../common/database/BaseRepository";
import { InterestModel, IInterestPersistence } from "../database/InterestModel";
import { InterestMapper } from "../mappers/InterestMapper";
import { InterestCategory } from "../../../shared/constants/interests.const";
import { INTEREST_KEYWORDS } from "../../../shared/constants/interest-keywords.const";

@injectable()
export class InterestRepository
  extends BaseRepository<IInterestPersistence, Interest>
  implements IInterestRepository
{
  constructor() {
    super(InterestModel, new InterestMapper());
  }

  async findByName(name: string): Promise<Interest | null> {
    const normalizedName = name.trim().toLowerCase();
    return this.findOne({ name: normalizedName } as Partial<Interest>);
  }

  async findOrCreate(name: string): Promise<Interest> {
    const normalizedName = name.trim().toLowerCase();

    const existing = await this.findByName(normalizedName);
    if (existing) return existing;

    const interest = new Interest({
      name: normalizedName,
      category: this.categorizeInterest(normalizedName),
    });
    return this.create(interest);
  }

  async search(query: string, limit: number = 10): Promise<Interest[]> {
    if (!query || query.trim().length < 2) return [];

    const docs = await this.model
      .find({
        $or: [{ name: { $regex: query, $options: "i" } }, { $text: { $search: query } }],
      })
      .limit(limit)
      .lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  // Get interests that are most frequently used
  async getPopular(limit: number = 20): Promise<Interest[]> {
    const popularInterests = await this.model.aggregate([
      {
        $lookup: {
          from: "userinterests",
          localField: "_id",
          foreignField: "interestId",
          as: "users",
        },
      },
      {
        $addFields: {
          popularity: { $size: "$users" },
        },
      },
      {
        $sort: { popularity: -1, name: 1 },
      },
      {
        $limit: limit,
      },
    ]);

    return popularInterests.map((doc) => this.mapper.toDomain(doc));
  }

  async findByIds(ids: string[]): Promise<Interest[]> {
    if (!ids.length) return [];

    const docs = await this.model.find({ _id: { $in: ids } }).lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  async findByCategory(category: InterestCategory, limit: number = 20): Promise<Interest[]> {
    const docs = await this.model.find({ category }).limit(limit).lean();

    return docs.map((doc) => this.mapper.toDomain(doc));
  }

  private categorizeInterest(name: string): InterestCategory {
    const lowerName = name.toLowerCase();

    for (const { keyword, category } of INTEREST_KEYWORDS) {
      if (lowerName.includes(keyword)) {
        return category;
      }
    }

    return InterestCategory.OTHER;
  }
}
