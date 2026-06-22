import { IBaseRepository } from "../../../core/common/repositories/IBaseRepository";
import { ServerInterest } from "../entities/ServerInterest";
import { Interest } from "../entities/Interest";

export interface IServerInterestRepository extends IBaseRepository<ServerInterest> {
  findByServer(serverId: string): Promise<Interest[]>;
  addInterests(serverId: string, interestIds: string[]): Promise<void>;
  removeInterests(serverId: string, interestIds: string[]): Promise<void>;
  findServersByInterests(
    interestIds: string[],
    limit?: number,
    excludeServerIds?: string[],
  ): Promise<Array<{ serverId: string; matchedInterests: string[]; matchCount: number }>>;
  getInterestIdsByServer(serverId: string): Promise<string[]>;
}
