import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { Interest } from "../entities/Interest";

export interface IInterestRepository extends IBaseRepository<Interest> {
  findByName(name: string): Promise<Interest | null>; // find interests by name
  findOrCreate(name: string): Promise<Interest>; // find or create an interest (find name or create interest name)
  search(query: string, limit?: number): Promise<Interest[]>; // search interest name
  getPopular(limit?: number): Promise<Interest[]>; // get popular interests
  findByIds(ids: string[]): Promise<Interest[]>; // Find multiple interests by their IDs
  findByCategory(category: string, limit?: number): Promise<Interest[]>; // Find interests by category
}
