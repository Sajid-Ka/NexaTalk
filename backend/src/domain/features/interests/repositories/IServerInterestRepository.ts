import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { ServerInterest } from "../entities/ServerInterest";
import { Interest } from "../entities/Interest";

export interface IServerInterestRepository extends IBaseRepository<ServerInterest> {
  findByServer(serverId: string): Promise<Interest[]>; // Find all interests for a specific server
  addInterests(serverId: string, interestIds: string[]): Promise<void>; // Add multiple interests to a server
  removeInterests(serverId: string, interestIds: string[]): Promise<void>; // Remove multiple interests from a server
  findServersByInterests(
    interestIds: string[],
    limit?: number,
    excludeServerIds?: string[],
  ): Promise<Array<{ serverId: string; matchedInterests: string[]; matchCount: number }>>; // Find servers that match given interests
  getInterestIdsByServer(serverId: string): Promise<string[]>; // Get all interest IDs for a server
}
