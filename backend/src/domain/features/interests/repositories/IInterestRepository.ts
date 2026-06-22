import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Interest } from "../entities/Interest";

export interface IInterestRepository extends IBaseRepository<Interest> {
  findByName(name: string): Promise<Interest | null>;
  findOrCreate(name: string): Promise<Interest>;
  search(query: string, limit?: number): Promise<Interest[]>;
  getPopular(limit?: number): Promise<Interest[]>;
  findByIds(ids: string[]): Promise<Interest[]>;
  findByCategory(category: string, limit?: number): Promise<Interest[]>;
}
